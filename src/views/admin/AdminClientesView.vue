<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import {
  listarClientes,
  crearCliente as apiCrearCliente,
  actualizarCliente as apiActualizarCliente,
  eliminarCliente as apiEliminarCliente
} from '@/services/clienteService'

const clientes = ref([])
const busqueda = ref('')
const loaded = ref(false)
const cargando = ref(true)

const clienteSeleccionado = ref(null)
const mostrarModalDetalle = ref(false)
const mostrarModalForm = ref(false)
const modoEdicion = ref(false)
const guardando = ref(false)

const tiposDocumento = ['CC', 'CE', 'PASAPORTE', 'TI', 'RC', 'NIT']

const formCliente = ref({
  nombre_completo: '',
  tipo_documento: 'CC',
  numero_documento: '',
  telefono: '',
  email: '',
  pais: '',
  ciudad: ''
})

const resetForm = () => {
  formCliente.value = {
    nombre_completo: '',
    tipo_documento: 'CC',
    numero_documento: '',
    telefono: '',
    email: '',
    pais: '',
    ciudad: ''
  }
}

onMounted(async () => {
  await cargarClientes()
  setTimeout(() => { loaded.value = true }, 100)
})

const cargarClientes = async () => {
  cargando.value = true
  try {
    clientes.value = await listarClientes()
  } catch {
    clientes.value = []
  } finally {
    cargando.value = false
  }
}

const clientesFiltrados = computed(() => {
  let resultado = [...clientes.value]
  if (busqueda.value.trim()) {
    const t = busqueda.value.toLowerCase().trim()
    resultado = resultado.filter(c => {
      const nombre = (c.nombre_completo || '').toLowerCase()
      const doc = (c.numero_documento || '').toLowerCase()
      const email = (c.email || '').toLowerCase()
      const ciudad = (c.ciudad || '').toLowerCase()
      return nombre.includes(t) || doc.includes(t) || email.includes(t) || ciudad.includes(t)
    })
  }
  return resultado
})

const getInitials = (c) => {
  const nombre = c.nombre_completo || 'SC'
  return nombre.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const formatearFecha = (fecha) => {
  if (!fecha) return '-'
  const d = new Date(fecha)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' })
}

const abrirNuevo = () => {
  modoEdicion.value = false
  resetForm()
  mostrarModalForm.value = true
}

const abrirEdicion = (cliente) => {
  modoEdicion.value = true
  clienteSeleccionado.value = cliente
  formCliente.value = {
    nombre_completo: cliente.nombre_completo || '',
    tipo_documento: cliente.tipo_documento || 'CC',
    numero_documento: cliente.numero_documento || '',
    telefono: cliente.telefono || '',
    email: cliente.email || '',
    pais: cliente.pais || '',
    ciudad: cliente.ciudad || ''
  }
  mostrarModalForm.value = true
}

const verDetalle = (cliente) => {
  clienteSeleccionado.value = cliente
  mostrarModalDetalle.value = true
}

const cerrarModalDetalle = () => {
  mostrarModalDetalle.value = false
  clienteSeleccionado.value = null
}

const cerrarModalForm = () => {
  mostrarModalForm.value = false
  clienteSeleccionado.value = null
  resetForm()
}

const emailValido = computed(() => {
  const email = formCliente.value.email
  if (!email) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
})

const guardarCliente = async () => {
  if (!formCliente.value.nombre_completo || !formCliente.value.numero_documento || !formCliente.value.email) {
    Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Nombre, documento y email son obligatorios.', confirmButtonColor: '#2e7d32' })
    return
  }

  if (!emailValido.value) {
    Swal.fire({ icon: 'warning', title: 'Email inválido', text: 'Ingresa un correo válido, por ejemplo: usuario@correo.com', confirmButtonColor: '#2e7d32' })
    return
  }

  guardando.value = true
  try {
    if (modoEdicion.value && clienteSeleccionado.value) {
      await apiActualizarCliente(clienteSeleccionado.value.id, formCliente.value)
      Swal.fire({ icon: 'success', title: 'Cliente actualizado', timer: 2000, showConfirmButton: false })
    } else {
      await apiCrearCliente(formCliente.value)
      Swal.fire({ icon: 'success', title: 'Cliente creado', timer: 2000, showConfirmButton: false })
    }
    cerrarModalForm()
    await cargarClientes()
  } catch (error) {
    const msg = error.response?.data?.detail || 'Error al guardar el cliente'
    Swal.fire({ icon: 'error', title: 'Error', text: typeof msg === 'string' ? msg : JSON.stringify(msg), confirmButtonColor: '#2e7d32' })
  } finally {
    guardando.value = false
  }
}

const eliminarCliente = (cliente) => {
  Swal.fire({
    title: 'Eliminar cliente',
    text: `¿Desea eliminar a ${cliente.nombre_completo}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#c0392b',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Si, eliminar',
    cancelButtonText: 'Cancelar'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await apiEliminarCliente(cliente.id)
        clientes.value = clientes.value.filter(c => c.id !== cliente.id)
        Swal.fire({ icon: 'success', title: 'Eliminado', timer: 2000, showConfirmButton: false })
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.detail || 'No se pudo eliminar', confirmButtonColor: '#2e7d32' })
      }
    }
  })
}

const contadorTotal = computed(() => clientes.value.length)
</script>

<template>
  <div class="clientes-admin" :class="{ loaded }">
    <!-- Header -->
    <div class="page-header" style="--delay: 0s">
      <div>
        <h1 class="page-title">Directorio de Clientes</h1>
        <p class="page-subtitle">Gestiona el registro de clientes del ecohotel</p>
      </div>
      <div class="header-actions">
        <button class="btn-nuevo" @click="abrirNuevo">
          <i class="bi bi-plus-lg me-2"></i>Nuevo Cliente
        </button>
        <div class="header-badge">
          <span class="badge-count">{{ contadorTotal }}</span>
          <span class="badge-label">Total</span>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar" style="--delay: 0.1s">
      <div class="search-input-wrap">
        <i class="bi bi-search search-icon"></i>
        <input type="text" class="search-input" placeholder="Buscar por nombre, documento, email o ciudad..." v-model="busqueda">
        <button v-if="busqueda" class="search-clear" @click="busqueda = ''"><i class="bi bi-x"></i></button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card" style="--delay: 0.15s">
      <div v-if="cargando" class="empty-state">
        <div class="empty-icon"><i class="bi bi-arrow-repeat spin-icon"></i></div>
        <p class="empty-title">Cargando clientes...</p>
      </div>

      <div v-else-if="clientesFiltrados.length === 0" class="empty-state">
        <div class="empty-icon"><i class="bi bi-people"></i></div>
        <p class="empty-title" v-if="clientes.length === 0">Sin clientes registrados</p>
        <p class="empty-title" v-else>Sin resultados</p>
        <p class="empty-desc" v-if="clientes.length === 0">Agrega tu primer cliente con el boton "Nuevo Cliente".</p>
        <p class="empty-desc" v-else>No se encontraron clientes con ese criterio.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Documento</th>
              <th>Telefono</th>
              <th>Ciudad</th>
              <th class="text-center">Registro</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
              <td>
                <div class="client-cell">
                  <div class="client-avatar">{{ getInitials(cliente) }}</div>
                  <div class="client-info">
                    <span class="client-name">{{ cliente.nombre_completo }}</span>
                    <span class="client-email">{{ cliente.email || '-' }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="doc-cell">
                  <span class="doc-type">{{ cliente.tipo_documento }}</span>
                  <span class="doc-number">{{ cliente.numero_documento }}</span>
                </div>
              </td>
              <td><span class="info-cell">{{ cliente.telefono || '-' }}</span></td>
              <td><span class="info-cell">{{ cliente.ciudad || '-' }}</span></td>
              <td class="text-center"><span class="date-cell">{{ formatearFecha(cliente.created_at) }}</span></td>
              <td class="text-center">
                <div class="action-group">
                  <button class="action-btn action-view" title="Ver detalle" @click="verDetalle(cliente)">
                    <i class="bi bi-eye"></i>
                  </button>
                  <button class="action-btn action-edit" title="Editar" @click="abrirEdicion(cliente)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="action-btn action-delete" title="Eliminar" @click="eliminarCliente(cliente)">
                    <i class="bi bi-trash3"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="mostrarModalDetalle && clienteSeleccionado" class="modal-overlay" @click.self="cerrarModalDetalle">
        <div class="modal-panel">
          <div class="modal-head">
            <div>
              <span class="modal-tag">Ficha del Cliente</span>
              <h2 class="modal-title">{{ clienteSeleccionado.nombre_completo }}</h2>
            </div>
            <button class="modal-close" @click="cerrarModalDetalle"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="modal-section">
            <div class="section-header"><i class="bi bi-person-vcard"></i><span>Identificacion</span></div>
            <div class="section-grid">
              <div class="info-item">
                <span class="info-label">Nombre Completo</span>
                <span class="info-value">{{ clienteSeleccionado.nombre_completo }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tipo Documento</span>
                <span class="info-value">{{ clienteSeleccionado.tipo_documento }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Numero Documento</span>
                <span class="info-value">{{ clienteSeleccionado.numero_documento }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ clienteSeleccionado.email || '-' }}</span>
              </div>
            </div>
          </div>

          <div class="modal-section">
            <div class="section-header"><i class="bi bi-geo-alt"></i><span>Contacto y Ubicacion</span></div>
            <div class="section-grid">
              <div class="info-item">
                <span class="info-label">Telefono</span>
                <span class="info-value">{{ clienteSeleccionado.telefono || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Pais</span>
                <span class="info-value">{{ clienteSeleccionado.pais || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ciudad</span>
                <span class="info-value">{{ clienteSeleccionado.ciudad || '-' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Registrado</span>
                <span class="info-value">{{ formatearFecha(clienteSeleccionado.created_at) }}</span>
              </div>
            </div>
          </div>

          <div class="modal-foot">
            <button class="btn-modal-edit" @click="cerrarModalDetalle(); abrirEdicion(clienteSeleccionado)">
              <i class="bi bi-pencil me-1"></i>Editar
            </button>
            <button class="btn-modal-close" @click="cerrarModalDetalle">Cerrar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Create / Edit Modal -->
    <Transition name="modal">
      <div v-if="mostrarModalForm" class="modal-overlay" @click.self="cerrarModalForm">
        <div class="modal-panel">
          <div class="modal-head">
            <div>
              <span class="modal-tag">{{ modoEdicion ? 'Editar Cliente' : 'Nuevo Cliente' }}</span>
              <h2 class="modal-title">{{ modoEdicion ? formCliente.nombre_completo || 'Editar' : 'Registrar Cliente' }}</h2>
            </div>
            <button class="modal-close" @click="cerrarModalForm"><i class="bi bi-x-lg"></i></button>
          </div>

          <div class="modal-section">
            <div class="form-grid">
              <div class="field-group field-full">
                <label class="field-label">Nombre Completo *</label>
                <input type="text" class="field-input" v-model="formCliente.nombre_completo" placeholder="Nombre completo del cliente">
              </div>
              <div class="field-group">
                <label class="field-label">Tipo Documento *</label>
                <select class="field-input field-select" v-model="formCliente.tipo_documento">
                  <option v-for="t in tiposDocumento" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Numero Documento *</label>
                <input type="text" class="field-input" v-model="formCliente.numero_documento" placeholder="Numero de documento">
              </div>
              <div class="field-group">
                <label class="field-label">Email *</label>
                <input type="email" class="field-input" :class="{ 'field-error': formCliente.email && !emailValido }" v-model="formCliente.email" placeholder="correo@ejemplo.com">
                <span v-if="formCliente.email && !emailValido" class="field-error-msg">
                  <i class="bi bi-exclamation-circle me-1"></i>Ingresa un correo válido (ejemplo: usuario@correo.com)
                </span>
              </div>
              <div class="field-group">
                <label class="field-label">Telefono</label>
                <input type="tel" class="field-input" v-model="formCliente.telefono" placeholder="+57 300 000 0000">
              </div>
              <div class="field-group">
                <label class="field-label">Pais</label>
                <input type="text" class="field-input" v-model="formCliente.pais" placeholder="Colombia">
              </div>
              <div class="field-group">
                <label class="field-label">Ciudad</label>
                <input type="text" class="field-input" v-model="formCliente.ciudad" placeholder="Puerto Asis">
              </div>
            </div>
          </div>

          <div class="modal-foot">
            <button class="btn-modal-close" @click="cerrarModalForm">Cancelar</button>
            <button class="btn-modal-save" @click="guardarCliente" :disabled="guardando">
              <i class="bi me-1" :class="guardando ? 'bi-arrow-repeat spin-icon' : 'bi-check-lg'"></i>
              {{ guardando ? 'Guardando...' : (modoEdicion ? 'Actualizar' : 'Crear Cliente') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.clientes-admin { font-family: 'DM Sans', sans-serif; }

/* Header */
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 24px; opacity: 0; transform: translateY(12px);
}
.clientes-admin.loaded .page-header,
.clientes-admin.loaded .search-bar,
.clientes-admin.loaded .table-card {
  animation: slideUp 0.5s ease forwards; animation-delay: var(--delay);
}
.page-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.75rem; font-weight: 700; color: #2c1810; margin: 0;
}
.page-subtitle { font-size: 0.85rem; color: #999; margin: 4px 0 0; }
.header-actions { display: flex; align-items: center; gap: 14px; }
.btn-nuevo {
  display: flex; align-items: center; padding: 10px 20px;
  background: #264e36; color: #fff; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
  cursor: pointer; transition: all 0.25s;
}
.btn-nuevo:hover { background: #1d3d2a; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(38,78,54,0.25); }
.header-badge {
  display: flex; flex-direction: column; align-items: center;
  background: #264e36; padding: 12px 20px; border-radius: 14px; min-width: 72px;
}
.badge-count { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1; }
.badge-label { font-size: 0.65rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

/* Search */
.search-bar { margin-bottom: 20px; opacity: 0; transform: translateY(12px); }
.search-input-wrap { position: relative; max-width: 420px; }
.search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #999; font-size: 0.88rem; }
.search-input {
  width: 100%; padding: 11px 40px 11px 42px;
  border: 1px solid rgba(0,0,0,0.06); border-radius: 12px; background: #fff;
  font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #2c1810;
  transition: all 0.2s; outline: none;
}
.search-input::placeholder { color: #bbb; }
.search-input:focus { border-color: rgba(38,78,54,0.4); box-shadow: 0 0 0 3px rgba(38,78,54,0.08); }
.search-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #999; cursor: pointer; font-size: 1.1rem; padding: 4px; }

/* Table */
.table-card {
  background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.04);
  overflow: hidden; opacity: 0; transform: translateY(12px);
}
.empty-state { text-align: center; padding: 60px 20px; }
.empty-icon {
  width: 72px; height: 72px; border-radius: 20px; background: rgba(38,78,54,0.06);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px; font-size: 1.8rem; color: #264e36;
}
.empty-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; font-weight: 600; color: #2c1810; margin-bottom: 4px; }
.empty-desc { font-size: 0.82rem; color: #999; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.admin-table thead th {
  font-size: 0.72rem; font-weight: 600; color: #999; text-transform: uppercase;
  letter-spacing: 1px; padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.04); background: #faf8f4;
}
.admin-table tbody tr { transition: background 0.15s; }
.admin-table tbody tr:hover { background: #fdfcf9; }
.admin-table tbody td { padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.03); vertical-align: middle; }

.client-cell { display: flex; align-items: center; gap: 12px; }
.client-avatar {
  width: 42px; height: 42px; border-radius: 12px;
  background: rgba(38,78,54,0.08); color: #264e36;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700; flex-shrink: 0; letter-spacing: 0.5px;
}
.client-info { display: flex; flex-direction: column; min-width: 0; }
.client-name { font-weight: 600; font-size: 0.88rem; color: #2c1810; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.client-email { font-size: 0.72rem; color: #999; }

.doc-cell { display: flex; flex-direction: column; gap: 2px; }
.doc-type { font-size: 0.65rem; font-weight: 600; color: #264e36; text-transform: uppercase; letter-spacing: 0.5px; }
.doc-number { font-size: 0.85rem; color: #555; }
.info-cell { font-size: 0.85rem; color: #555; }
.date-cell { font-size: 0.82rem; color: #999; }

/* Actions */
.action-group { display: flex; align-items: center; justify-content: center; gap: 4px; }
.action-btn {
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06);
  background: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; cursor: pointer; transition: all 0.2s; color: #888;
}
.action-view:hover { background: rgba(38,78,54,0.06); border-color: rgba(38,78,54,0.15); color: #264e36; }
.action-edit:hover { background: rgba(218,165,32,0.06); border-color: rgba(218,165,32,0.2); color: #b8860b; }
.action-delete:hover { background: rgba(192,57,43,0.04); border-color: rgba(192,57,43,0.15); color: #c0392b; }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(15,10,5,0.5); backdrop-filter: blur(4px);
  z-index: 1050; display: flex; align-items: center; justify-content: center; padding: 20px;
}
.modal-panel {
  width: 100%; max-width: 640px; max-height: 88vh; overflow-y: auto;
  background: #fff; border-radius: 20px; box-shadow: 0 24px 64px rgba(0,0,0,0.15);
}
.modal-head { display: flex; align-items: flex-start; justify-content: space-between; padding: 28px 28px 20px; }
.modal-tag { font-size: 0.68rem; font-weight: 600; color: #264e36; text-transform: uppercase; letter-spacing: 1.5px; }
.modal-title { font-family: 'Playfair Display', serif; font-size: 1.4rem; font-weight: 700; color: #2c1810; margin: 4px 0 0; }
.modal-close {
  width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(0,0,0,0.06);
  background: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 0.85rem; color: #999; transition: all 0.2s;
}
.modal-close:hover { background: #f5f2ec; color: #2c1810; }

.modal-section { padding: 20px 28px; border-bottom: 1px solid rgba(0,0,0,0.04); }
.section-header { display: flex; align-items: center; gap: 8px; font-size: 0.82rem; font-weight: 600; color: #2c1810; margin-bottom: 16px; }
.section-header i { color: #264e36; }
.section-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.info-item { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 0.68rem; font-weight: 600; color: #999; text-transform: uppercase; letter-spacing: 0.5px; }
.info-value { font-size: 0.9rem; color: #2c1810; font-weight: 500; }

.modal-foot { padding: 20px 28px; display: flex; justify-content: flex-end; gap: 10px; }
.btn-modal-close {
  padding: 10px 24px; border: 1px solid rgba(0,0,0,0.08); border-radius: 10px;
  background: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
  font-weight: 500; color: #555; cursor: pointer; transition: all 0.2s;
}
.btn-modal-close:hover { background: #f5f2ec; border-color: rgba(0,0,0,0.12); }
.btn-modal-edit {
  padding: 10px 24px; border: 1.5px solid #264e36; border-radius: 10px;
  background: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
  font-weight: 600; color: #264e36; cursor: pointer; transition: all 0.2s;
}
.btn-modal-edit:hover { background: rgba(38,78,54,0.04); }
.btn-modal-save {
  padding: 10px 24px; border: none; border-radius: 10px;
  background: #264e36; font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
  font-weight: 600; color: #fff; cursor: pointer; transition: all 0.25s;
  display: flex; align-items: center;
}
.btn-modal-save:hover { background: #1d3d2a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(38,78,54,0.2); }
.btn-modal-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }

/* Form */
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.field-group { display: flex; flex-direction: column; }
.field-full { grid-column: 1 / -1; }
.field-label { font-size: 0.75rem; font-weight: 600; color: #555; margin-bottom: 6px; letter-spacing: 0.2px; }
.field-input {
  width: 100%; padding: 11px 14px; border: 1.5px solid #e0e0de; border-radius: 11px;
  background: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: #1a3325;
  transition: border-color 0.25s, box-shadow 0.25s; outline: none;
}
.field-input::placeholder { color: #bbb; }
.field-input:focus { border-color: #264e36; box-shadow: 0 0 0 3px rgba(38,78,54,0.08); }
.field-input.field-error { border-color: #c0392b; }
.field-input.field-error:focus { border-color: #c0392b; box-shadow: 0 0 0 3px rgba(192,57,43,0.1); }
.field-error-msg { font-size: 0.72rem; color: #c0392b; margin-top: 4px; display: flex; align-items: center; }
.field-select { appearance: none; -webkit-appearance: none; cursor: pointer; }

/* Modal transitions */
.modal-enter-active { transition: opacity 0.3s ease; }
.modal-enter-active .modal-panel { animation: modalIn 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@keyframes modalIn { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }

/* Responsive */
@media (max-width: 991px) { .section-grid, .form-grid { grid-template-columns: 1fr; } .field-full { grid-column: 1; } }
@media (max-width: 575px) {
  .page-header { flex-direction: column; gap: 16px; }
  .header-actions { width: 100%; justify-content: space-between; }
  .modal-panel { border-radius: 16px 16px 0 0; }
  .modal-overlay { align-items: flex-end; padding: 0; }
  .modal-head, .modal-section, .modal-foot { padding-left: 20px; padding-right: 20px; }
}
</style>
