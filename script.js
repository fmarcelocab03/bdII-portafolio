  // script.js - Versión revisada: visor PDF más grande y botón al repositorio GitHub
  const SUPABASE_URL = "https://kgnswyjapsymsmngpfno.supabase.co";
  const SUPABASE_KEY = "sb_publishable_rLSjuvK1zCS50UX_qlNkkg_oo6QEq2_";
let modal;
let esAdmin = false;
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("Supabase conectado:", supabaseClient);
  document.addEventListener("DOMContentLoaded", function () {
    ocultarAdmin();
    const GITHUB_REPO_URL = "https://github.com/fmarcelocab03/bdII-portafolio/tree/main/archivos";
    
    const iconos = [
      "💻", "🧮", "🗃️", "🧩", "📊", "🗄️", "🔎", "🧑‍💻",
      "🏗️", "⚠️", "📦", "🔗", "🌳", "🕸️", "📚", "🏆"
    ];
    
    let semanas = [];
    const contenedor = document.getElementById("contenedor-semanas");
    modal = document.getElementById("modal-tarea");
    if (localStorage.getItem("admin") === "true") {
  esAdmin = true;
  mostrarAdmin();
  mostrarLogout(); // 👈 🔥 IMPORTANTE
}
  async function cargarDatos() {

  const { data: unidadesData, error: errorU } = await supabaseClient
    .from("unidades")
    .select("*");

  console.log("UNIDADES:", unidadesData, errorU);

  const { data: semanasData, error: errorS } = await supabaseClient
    .from("semanas")
    .select("*");

  console.log("SEMANAS:", semanasData, errorS);

  const { data: archivosData, error: errorA } = await supabaseClient
    .from("archivos")
    .select("*");

  console.log("ARCHIVOS:", archivosData, errorA);

  if (errorU || errorS || errorA) {
    console.error("Error en Supabase");
    return;
  }

  if (!unidadesData || unidadesData.length === 0) {
    console.warn("No hay unidades creadas ⚠️");
    return;
  }

  // Ordenar unidades por ID (u1, u2, u3, u4)
const ordenUnidades = ['u1', 'u2', 'u3', 'u4'];
const unidadesOrdenadas = [...unidadesData].sort((a, b) => {
  return ordenUnidades.indexOf(a.id) - ordenUnidades.indexOf(b.id);
});

const unidades = unidadesOrdenadas.map(u => ({
    ...u,
    semanas: semanasData
      .filter(s => s.unidad_id === u.id)
      // ORDENAR semanas numéricamente: semana1, semana2... semana16
      .sort((a, b) => {
        const numA = parseInt(a.id.replace('semana', ''));
        const numB = parseInt(b.id.replace('semana', ''));
        return numA - numB;
      })
      .map(s => ({
        ...s,
        archivos: archivosData.filter(a => a.semana_id === s.id)
      }))
  }));

  console.log("ESTRUCTURA FINAL:", unidades);

  renderUnidades(unidades);
}
    function renderUnidades(unidades) {
  contenedor.innerHTML = "";

  unidades.forEach(unidad => {

    // 📦 CONTENEDOR UNIDAD
    const divUnidad = document.createElement("div");
    divUnidad.style.marginBottom = "30px";

    // Contenedor del título con botones de admin
// Contenedor del título con diseño premium
const tituloContainer = document.createElement('div');
tituloContainer.className = 'unidad-header';

// Título de la unidad
const tituloDiv = document.createElement('div');
tituloDiv.className = 'unidad-titulo';

const iconoUnidad = document.createElement('span');
iconoUnidad.className = 'icono-unidad';
iconoUnidad.textContent = '📘';

const nombreUnidad = document.createElement('span');
nombreUnidad.className = 'nombre-unidad';
nombreUnidad.textContent = unidad.nombre;

tituloDiv.appendChild(iconoUnidad);
tituloDiv.appendChild(nombreUnidad);
tituloContainer.appendChild(tituloDiv);

// Si es admin, agregar botones premium de editar/eliminar unidad
if (esAdmin) {
  const unidadActions = document.createElement('div');
  unidadActions.className = 'unidad-actions';
  
  // Botón Editar Unidad
  const btnEditarUnidad = document.createElement('button');
  btnEditarUnidad.className = 'unidad-btn editar-unidad-btn';
  btnEditarUnidad.setAttribute('data-tooltip', 'Editar nombre de la unidad');
  btnEditarUnidad.innerHTML = '<span class="btn-icono">✏️</span> Editar';
  btnEditarUnidad.addEventListener('click', function(e) {
    e.stopPropagation();
    editarUnidad(unidad.id);
  });
  
  // Botón Eliminar Unidad
  const btnEliminarUnidad = document.createElement('button');
  btnEliminarUnidad.className = 'unidad-btn eliminar-unidad-btn';
  btnEliminarUnidad.setAttribute('data-tooltip', 'Eliminar unidad completa');
  btnEliminarUnidad.innerHTML = '<span class="btn-icono">🗑️</span> Eliminar';
  btnEliminarUnidad.addEventListener('click', function(e) {
    e.stopPropagation();
    eliminarUnidad(unidad.id);
  });
  
  unidadActions.appendChild(btnEditarUnidad);
  unidadActions.appendChild(btnEliminarUnidad);
  tituloContainer.appendChild(unidadActions);
}

divUnidad.appendChild(tituloContainer);



    // 📅 GRID DE SEMANAS
    const grid = document.createElement("div");
    grid.className = "grid-semanas";

    unidad.semanas.forEach((semana, idx) => {
  const card = document.createElement("div");
  card.className = "tarjeta-semana";

  card.innerHTML = `
    <span class="icon-semana">📅</span>
    <div class="tarjeta-semana-title">${semana.label}</div>
    <div class="tarjeta-semana-desc">${semana.descripcion}</div>
    <div class="admin-actions-container"></div>
  `;

  // Si es admin, agregamos los botones después
  if (esAdmin) {
    const actionsContainer = card.querySelector('.admin-actions-container');
    
    const adminActions = document.createElement('div');
    adminActions.className = 'admin-actions';
    
    const btnEditar = document.createElement('button');
    btnEditar.className = 'admin-btn editar-btn';
    btnEditar.title = 'Editar semana';
    btnEditar.innerHTML = '✏️ <span class="btn-texto">Editar</span>';
    btnEditar.addEventListener('click', function(e) {
      e.stopPropagation();
      editarSemana(semana.id);
    });
    
    const btnEliminar = document.createElement('button');
    btnEliminar.className = 'admin-btn eliminar-btn';
    btnEliminar.title = 'Eliminar semana';
    btnEliminar.innerHTML = '🗑️ <span class="btn-texto">Eliminar</span>';
    btnEliminar.addEventListener('click', function(e) {
      e.stopPropagation();
      eliminarSemana(semana.id);
    });
    
    adminActions.appendChild(btnEditar);
    adminActions.appendChild(btnEliminar);
    actionsContainer.appendChild(adminActions);
  }

  // Evento para abrir el modal (solo si no se clickeó en botones)
  card.addEventListener('click', function(e) {
    // Si el clic fue en un botón admin, no hacer nada
    if (e.target.closest('.admin-btn')) {
      return;
    }
    abrirModalPorSemana(semana);
  });

  grid.appendChild(card);
});

    divUnidad.appendChild(grid);
    contenedor.appendChild(divUnidad);
  });
}
    function actualizarTarjetasSemanas() {
      contenedor.innerHTML = "";
      semanas.forEach(({ label, descripcion }, idx) => {
        const card = document.createElement("div");
        card.className = "tarjeta-semana";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.innerHTML = `
          <span class="icon-semana">${iconos[idx % iconos.length]}</span>
          <div class="tarjeta-semana-title">${label}</div>
          <div class="tarjeta-semana-desc">${descripcion}</div>
        `;
        card.addEventListener("click", () => abrirModal(idx));
        card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") abrirModal(idx); });
        contenedor.appendChild(card);
      });
    }
    async function iniciarApp() {
    await cargarDatos();
  }

    // Función para colapsar/expandir el panel admin
window.toggleAdminCollapse = function() {
  const panel = document.getElementById('admin-panel');
  const icon = document.getElementById('admin-toggle-icon');
  
  panel.classList.toggle('collapsed');
  
  if (panel.classList.contains('collapsed')) {
    icon.textContent = '▲';
  } else {
    icon.textContent = '▼';
  }
};
    function disableBodyScroll() { document.body.style.overflow = "hidden"; }
    function enableBodyScroll() { document.body.style.overflow = ""; }

    let previousActiveElement = null;
    let focusTrapHandler = null;
    let escHandler = null;

    function trapFocus(container) {
      const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(container.querySelectorAll(selector)).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      focusTrapHandler = function (e) {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      container.addEventListener("keydown", focusTrapHandler);
      first.focus();
    }
    function releaseFocus(container) {
      if (focusTrapHandler) container.removeEventListener("keydown", focusTrapHandler);
      focusTrapHandler = null;
    }
    window.crearUnidad = async function () {
  const id = document.getElementById("unidad_id").value;
  const nombre = document.getElementById("unidad_nombre").value;

  const { error } = await supabaseClient
    .from("unidades")
    .insert([{ id, nombre }]);

  if (error) {
    alert("Error");
  } else {
    alert("Unidad creada ✅");
    cargarDatos();
  }
};
  // =============================================
// FUNCIONES INTELIGENTES PARA EL PANEL DE ADMIN
// =============================================

// Función para obtener el ID de unidad basado en el número de semana
function obtenerUnidadId(numeroSemana) {
  const num = parseInt(numeroSemana);
  if (num >= 1 && num <= 4) return 'u1';
  if (num >= 5 && num <= 8) return 'u2';
  if (num >= 9 && num <= 12) return 'u3';
  if (num >= 13 && num <= 16) return 'u4';
  return null; // Fuera de rango
}

// Función para obtener el nombre de unidad basado en el ID
function obtenerNombreUnidad(unidadId) {
  const unidades = {
    'u1': 'Unidad 1',
    'u2': 'Unidad 2',
    'u3': 'Unidad 3',
    'u4': 'Unidad 4',
    'u5': 'Unidad 5'
  };
  return unidades[unidadId] || 'Unidad Desconocida';
}

// Previsualizar la creación de semana
window.previsualizarSemana = function() {
  const numSemana = document.getElementById('numero_semana').value;
  const descripcion = document.getElementById('descripcion_semana').value;
  const preview = document.getElementById('preview-semana');
  
  if (numSemana && numSemana >= 1 && numSemana <= 16) {
    const unidadId = obtenerUnidadId(numSemana);
    document.getElementById('preview-id').textContent = `semana${numSemana}`;
    document.getElementById('preview-unidad').textContent = `${unidadId} - ${obtenerNombreUnidad(unidadId)}`;
    document.getElementById('preview-label').textContent = `Semana ${numSemana}${descripcion ? ' - ' + descripcion : ''}`;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
};

// Mostrar información de la semana para subir archivo
window.mostrarInfoSemana = function() {
  const numSemana = document.getElementById('semana_destino').value;
  const preview = document.getElementById('preview-archivo');
  
  if (numSemana && numSemana >= 1 && numSemana <= 16) {
    const unidadId = obtenerUnidadId(numSemana);
    document.getElementById('preview-semana-id').textContent = `semana${numSemana}`;
    document.getElementById('preview-unidad-destino').textContent = `${unidadId} - ${obtenerNombreUnidad(unidadId)}`;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
};

// Crear semana automáticamente
window.crearSemanaAuto = async function () {
  const numSemana = document.getElementById('numero_semana').value;
  const descripcion = document.getElementById('descripcion_semana').value;
  
  // Validaciones
  if (!numSemana || numSemana < 1 || numSemana > 16) {
    alert('❌ Por favor ingresa un número de semana válido (1-16)');
    return;
  }
  
  if (!descripcion) {
    alert('❌ Por favor ingresa una descripción para la semana');
    return;
  }
  
  const semanaId = `semana${numSemana}`;
  const label = `Semana ${numSemana}`;
  const unidadId = obtenerUnidadId(numSemana);
  
  console.log('Creando semana:', {
    id: semanaId,
    label: label,
    descripcion: descripcion,
    unidad_id: unidadId
  });
  
  const { data, error } = await supabaseClient
    .from('semanas')
    .insert([{ 
      id: semanaId, 
      label: label, 
      descripcion: descripcion, 
      unidad_id: unidadId 
    }]);

  if (error) {
    console.error('Error:', error);
    alert(`❌ Error al crear semana: ${error.message}`);
  } else {
    alert(`✅ Semana ${numSemana} creada exitosamente en ${unidadId}`);
    
    // Limpiar campos
    document.getElementById('numero_semana').value = '';
    document.getElementById('descripcion_semana').value = '';
    document.getElementById('preview-semana').style.display = 'none';
    
    // Recargar datos
    cargarDatos();
  }
};

// Subir archivo automáticamente
// Subir archivo automáticamente
window.subirArchivoAuto = async function () {
  const numSemana = document.getElementById('semana_destino').value;
  const nombreArchivo = document.getElementById('nombre_archivo').value;
  const file = document.getElementById('file_input').files[0];
  
  // Validaciones
  if (!numSemana || numSemana < 1 || numSemana > 16) {
    alert('❌ Por favor ingresa un número de semana válido (1-16)');
    return;
  }
  
  if (!nombreArchivo) {
    alert('❌ Por favor ingresa un nombre para el archivo');
    return;
  }
  
  if (!file) {
    alert('❌ Por favor selecciona un archivo');
    return;
  }
  
  const semanaId = `semana${numSemana}`;
  const fileName = Date.now() + '_' + file.name;
  
  // Generar un ID único para el archivo
  const idUnico = Date.now();
  
  try {
    // Subir a storage
    console.log('📤 Subiendo archivo a Storage...');
    const { data, error } = await supabaseClient.storage
      .from('archivos')
      .upload(fileName, file);

    if (error) {
      console.error('Error al subir archivo:', error);
      alert(`❌ Error al subir archivo: ${error.message}`);
      return;
    }

    console.log('✅ Archivo subido a Storage correctamente');

    // Obtener URL pública
    const { data: urlData } = supabaseClient.storage
      .from('archivos')
      .getPublicUrl(fileName);

    const enlace = urlData.publicUrl;
    console.log('🔗 URL pública:', enlace);

    // Guardar en BD con ID único
    console.log('💾 Guardando en base de datos...');
    const { error: dbError } = await supabaseClient
      .from('archivos')
      .insert([{ 
        id: idUnico,           // ← ID único para evitar duplicados
        semana_id: semanaId, 
        nombre: nombreArchivo, 
        enlace: enlace 
      }]);

    if (dbError) {
      console.error('Error guardando en BD:', dbError);
      alert(`❌ Error guardando en base de datos: ${dbError.message}`);
    } else {
      alert(`✅ Archivo "${nombreArchivo}" subido exitosamente a Semana ${numSemana}`);
      
      // Limpiar campos
      document.getElementById('semana_destino').value = '';
      document.getElementById('nombre_archivo').value = '';
      document.getElementById('file_input').value = '';
      document.getElementById('preview-archivo').style.display = 'none';
      
      // Recargar datos
      cargarDatos();
    }
  } catch (error) {
    console.error('Error inesperado:', error);
    alert('❌ Ocurrió un error inesperado');
  }
};
// ----- Navegación por flechas en lista de archivos -----
function enableArrowNavigation(listContainer) {
  const items = Array.from(listContainer.querySelectorAll(".file-item"));
  if (!items.length) return;
  items.forEach((it, idx) => {
    it.setAttribute("role", "button");
    it.setAttribute("tabindex", "0");
    it.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { 
        e.preventDefault(); 
        items[(idx + 1) % items.length].focus(); 
      } else if (e.key === "ArrowUp") { 
        e.preventDefault(); 
        items[(idx - 1 + items.length) % items.length].focus(); 
      } else if (e.key === "Enter" || e.key === " ") { 
        e.preventDefault(); 
        it.click(); 
      }
    });
  });
}
    function crearViewerElemento(archivo) {
      const wrapper = document.createElement("div");
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.justifyContent = "center";

      if (!archivo || !archivo.enlace) {
        wrapper.textContent = "Archivo no disponible";
        wrapper.style.color = "#555";
        wrapper.style.padding = "1rem";
        return wrapper;
      }

      const enlace = archivo.enlace.toLowerCase();
      if (/\.(pdf)(\?.*)?$/i.test(enlace)) {
        const embed = document.createElement("embed");
        embed.src = archivo.enlace;
        embed.type = "application/pdf";
        embed.style.width = "100%";
        embed.style.height = "100%";
        wrapper.appendChild(embed);
        return wrapper;
      }

      if (/\.(png|jpe?g|gif|webp|svg)$/i.test(enlace)) {
        const img = document.createElement("img");
        img.src = archivo.enlace;
        img.alt = archivo.nombre || "Archivo";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        wrapper.appendChild(img);
        return wrapper;
      }

      const p = document.createElement("div");
      p.style.padding = "1rem";
      p.style.textAlign = "center";
      const a = document.createElement("a");
      a.href = archivo.enlace;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "abrir-pdf-btn";
      a.textContent = "Abrir archivo en nueva pestaña";
      p.appendChild(a);
      wrapper.appendChild(p);
      return wrapper;
    }
    function mostrarAdmin() {
  const panel = document.getElementById('admin-panel');
  panel.style.display = 'block';
  // Asegura que empiece expandido
  panel.classList.remove('collapsed');
  const icon = document.getElementById('admin-toggle-icon');
  if (icon) icon.textContent = '▼';
}

function ocultarAdmin() {
  document.getElementById('admin-panel').style.display = 'none';
}

window.loginAdmin = function () {
  const user = document.getElementById("admin-user").value;
  const pass = document.getElementById("admin-pass").value;

  if (user === "admin" && pass === "1234") {
    esAdmin = true;

    localStorage.setItem("admin", "true"); // 🔥 importante

    alert("Bienvenido Admin 🔥");

    cerrarModalAdmin();
    mostrarAdmin();
    mostrarLogout(); // 👈 🔥 AQUÍ

    cargarDatos();

  } else {
    alert("Credenciales incorrectas ❌");
  }
};
window.toggleAdminLogin = function () {
  document.getElementById("admin-login-modal").style.display = "flex";
};
window.cerrarModalAdmin = function () {
  document.getElementById("admin-login-modal").style.display = "none";
};
window.logoutAdmin = function () {
  esAdmin = false;
  localStorage.removeItem("admin");

  ocultarAdmin();
  ocultarLogout(); // 👈 🔥 AQUÍ

  cargarDatos();
};
window.editarSemana = async function (id) {
  const nuevoNombre = prompt("Nuevo nombre:");
  const nuevaDesc = prompt("Nueva descripción:");

  const { error } = await supabaseClient
    .from("semanas")
    .update({
      label: nuevoNombre,
      descripcion: nuevaDesc
    })
    .eq("id", id);

  if (error) {
    alert("Error al editar");
  } else {
    alert("Actualizado ✅");
    cargarDatos();
  }
};
window.eliminarSemana = async function (id) {
  console.log('🗑️ Intentando eliminar semana:', id);
  
  const confirmar = confirm("¿Estás seguro de eliminar esta semana? Se eliminarán también todos sus archivos.");
  
  if (!confirmar) {
    console.log('❌ Eliminación cancelada');
    return;
  }
  
  try {
    // PASO 1: Eliminar archivos asociados
    console.log('📁 Eliminando archivos de la semana...');
    
    // Primero eliminamos los registros de archivos
    const { error: errorDeleteArchivos } = await supabaseClient
      .from("archivos")
      .delete()
      .eq("semana_id", id);
    
    if (errorDeleteArchivos) {
      console.error('Error eliminando archivos:', errorDeleteArchivos);
      // Continuamos para intentar eliminar la semana
    } else {
      console.log('✅ Archivos eliminados de la BD');
    }
    
    // PASO 2: Eliminar la semana
    console.log('📅 Eliminando semana:', id);
    const { error } = await supabaseClient
      .from("semanas")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('❌ Error al eliminar semana:', error);
      alert("❌ Error al eliminar: " + error.message);
    } else {
      console.log('✅ Semana eliminada exitosamente');
      alert("✅ Semana eliminada correctamente");
      cargarDatos();
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    alert("❌ Error: " + error.message);
  }
};
// Editar unidad
window.editarUnidad = async function (id) {
  const nuevoNombre = prompt("Nuevo nombre para la unidad:");
  
  if (!nuevoNombre || nuevoNombre.trim() === '') {
    alert('❌ Debes ingresar un nombre válido');
    return;
  }

  const { error } = await supabaseClient
    .from("unidades")
    .update({
      nombre: nuevoNombre.trim()
    })
    .eq("id", id);

  if (error) {
    console.error('Error al editar unidad:', error);
    alert("❌ Error al editar unidad: " + error.message);
  } else {
    alert("✅ Unidad actualizada correctamente");
    cargarDatos();
  }
};

// Eliminar unidad
window.eliminarUnidad = async function (id) {
  console.log('🗑️ Intentando eliminar unidad:', id);
  
  const confirmar = confirm("¿Estás seguro de eliminar esta unidad? Se eliminarán TODAS las semanas y archivos asociados.");
  
  if (!confirmar) {
    console.log('❌ Eliminación cancelada');
    return;
  }
  
  try {
    // PASO 1: Obtener las semanas de esta unidad
    const { data: semanas, error: errorSemanas } = await supabaseClient
      .from("semanas")
      .select("id")
      .eq("unidad_id", id);
    
    if (errorSemanas) {
      console.error('Error obteniendo semanas:', errorSemanas);
    }
    
    // PASO 2: Eliminar archivos de cada semana
    if (semanas && semanas.length > 0) {
      for (const semana of semanas) {
        console.log('📁 Eliminando archivos de semana:', semana.id);
        
        const { error: errorArchivos } = await supabaseClient
          .from("archivos")
          .delete()
          .eq("semana_id", semana.id);
        
        if (errorArchivos) {
          console.error('Error eliminando archivos:', errorArchivos);
        }
      }
      
      // PASO 3: Eliminar las semanas
      console.log('📅 Eliminando semanas de la unidad...');
      const { error: errorDeleteSemanas } = await supabaseClient
        .from("semanas")
        .delete()
        .eq("unidad_id", id);
      
      if (errorDeleteSemanas) {
        console.error('Error eliminando semanas:', errorDeleteSemanas);
      }
    }
    
    // PASO 4: Eliminar la unidad
    console.log('📦 Eliminando unidad:', id);
    const { error } = await supabaseClient
      .from("unidades")
      .delete()
      .eq("id", id);

    if (error) {
      console.error('❌ Error al eliminar unidad:', error);
      alert("❌ Error al eliminar unidad: " + error.message);
    } else {
      console.log('✅ Unidad eliminada exitosamente');
      alert("✅ Unidad eliminada correctamente");
      cargarDatos();
    }
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    alert("❌ Error: " + error.message);
  }
};
function mostrarLogout() {
  document.getElementById("logout-btn").style.display = "inline-block";
}

function ocultarLogout() {
  document.getElementById("logout-btn").style.display = "none";
}
function renderAdminSemanas() {
  const panel = document.getElementById("admin-panel");

  let html = "<h3>Gestionar Semanas</h3>";

  semanas.forEach(s => {
    html += `
      <div style="border:1px solid #ccc; margin:10px; padding:10px;">
        <strong>${s.label}</strong><br>
        ${s.descripcion}<br><br>

        <button onclick="editarSemana('${s.id}')">✏️ Editar</button>
        <button onclick="eliminarSemana('${s.id}')">🗑️ Eliminar</button>
      </div>
    `;
  });

  panel.innerHTML += html;
}
    // ========== EDITAR Y ELIMINAR ARCHIVOS ==========

window.editarArchivo = async function(id, nombreActual) {
  const nuevoNombre = prompt("Editar nombre del archivo:", nombreActual);
  
  if (!nuevoNombre || nuevoNombre.trim() === '') {
    return;
  }
  
  const { error } = await supabaseClient
    .from("archivos")
    .update({ nombre: nuevoNombre.trim() })
    .eq("id", id);
  
  if (error) {
    alert("❌ Error al editar: " + error.message);
  } else {
    alert("✅ Archivo actualizado correctamente");
    cargarDatos();
  }
};

window.eliminarArchivo = async function(id, archivoEnlace) {
  const confirmar = confirm("⚠️ ¿Estás seguro de eliminar este archivo?\n\nEsta acción NO se puede deshacer.");
  
  if (!confirmar) return;
  
  try {
    // Intentar eliminar del storage
    if (archivoEnlace) {
      const urlPartes = archivoEnlace.split('/');
      const nombreArchivo = urlPartes[urlPartes.length - 1];
      
      if (nombreArchivo) {
        await supabaseClient.storage
          .from('archivos')
          .remove([nombreArchivo]);
      }
    }
    
    // Eliminar de la base de datos
    const { error } = await supabaseClient
      .from("archivos")
      .delete()
      .eq("id", id);
    
    if (error) {
      alert("❌ Error al eliminar: " + error.message);
    } else {
      alert("✅ Archivo eliminado correctamente");
      cargarDatos();
    }
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
};
iniciarApp();
    function closeModal() {
      if (!modal.classList.contains("mostrar")) return;
      modal.classList.remove("mostrar");
      modal.setAttribute("aria-hidden", "true");
      enableBodyScroll();

      modal.innerHTML = "";

      if (escHandler) { document.removeEventListener("keydown", escHandler); escHandler = null; }

      if (previousActiveElement && typeof previousActiveElement.focus === "function") previousActiveElement.focus();
      previousActiveElement = null;
    }


    function abrirModalPorSemana(semana) {
      const tieneArchivos = Array.isArray(semana.archivos) && semana.archivos.length > 0;
      const primerArchivo = tieneArchivos ? semana.archivos[0] : null;

      previousActiveElement = document.activeElement;

      const modalContent = document.createElement("div");
      modalContent.className = "modal-content";
      modalContent.setAttribute("role", "dialog");
      modalContent.setAttribute("aria-modal", "true");
      modalContent.setAttribute("aria-label", semana.label);

      const top = document.createElement("div");
      top.className = "modal-top";
      const info = document.createElement("div");
      const title = document.createElement("div");
      title.className = "modal-tarea-title";
      title.textContent = semana.label;
      const desc = document.createElement("div");
      desc.className = "modal-tarea-desc";
      desc.style.color = "var(--text-main)";
      desc.style.fontSize = "0.95rem";
      desc.textContent = semana.descripcion || "";
      info.appendChild(title);
      info.appendChild(desc);

      const topRight = document.createElement("div");
      const volverBtn = document.createElement("button");
      volverBtn.className = "volver-btn";
      volverBtn.type = "button";
      volverBtn.textContent = "⟵ Volver";
      volverBtn.addEventListener("click", closeModal);
      topRight.appendChild(volverBtn);

      top.appendChild(info);
      top.appendChild(topRight);

      const body = document.createElement("div");
      body.className = "modal-body";

      const filesCol = document.createElement("div");
      filesCol.className = "modal-files";
      filesCol.id = "modal-files";
      const h3 = document.createElement("h3");
      h3.textContent = "Archivos";
      filesCol.appendChild(h3);

      if (tieneArchivos) {
        semana.archivos.forEach((a, i) => {
          // Contenedor para el archivo + botones admin
          const fileContainer = document.createElement("div");
          fileContainer.style.cssText = 'display:flex; align-items:center; gap:6px; margin-bottom:4px;';
          
          // Botón principal del archivo
          const btn = document.createElement("button");
          btn.className = "file-item";
          btn.type = "button";
          btn.setAttribute("data-file-index", String(i));
          btn.textContent = `📎 ${a.nombre}`;
          btn.style.flex = '1';
          btn.addEventListener("click", function () {
            filesCol.querySelectorAll(".file-item").forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            const viewerArea = modalContent.querySelector("#viewer-area");
            viewerArea.innerHTML = "";
            viewerArea.appendChild(crearViewerElemento(a));
            const abrir = modalContent.querySelector(".abrir-pdf-btn");
            if (abrir) abrir.href = a.enlace || "#";
          });
          
          fileContainer.appendChild(btn);
          
          // Si es admin, agregar botones de editar/eliminar archivo
          if (esAdmin) {
            // Botón Editar Archivo
            const btnEditarArchivo = document.createElement("button");
            btnEditarArchivo.className = "admin-btn editar-btn";
            btnEditarArchivo.title = "Editar archivo";
            btnEditarArchivo.innerHTML = "✏️";
            btnEditarArchivo.style.cssText = 'padding:4px 8px; font-size:12px; min-width:28px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:rgba(96,165,250,0.15); color:#60a5fa; border:1px solid rgba(96,165,250,0.3); border-radius:6px;';
            btnEditarArchivo.onclick = (e) => {
              e.stopPropagation();
              editarArchivo(a.id, a.nombre);
            };
            
            // Botón Eliminar Archivo
            const btnEliminarArchivo = document.createElement("button");
            btnEliminarArchivo.className = "admin-btn eliminar-btn";
            btnEliminarArchivo.title = "Eliminar archivo";
            btnEliminarArchivo.innerHTML = "🗑️";
            btnEliminarArchivo.style.cssText = 'padding:4px 8px; font-size:12px; min-width:28px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; cursor:pointer; background:rgba(248,113,113,0.15); color:#f87171; border:1px solid rgba(248,113,113,0.3); border-radius:6px;';
            btnEliminarArchivo.onclick = (e) => {
              e.stopPropagation();
              eliminarArchivo(a.id, a.enlace);
            };
            
            fileContainer.appendChild(btnEditarArchivo);
            fileContainer.appendChild(btnEliminarArchivo);
          }
          
          filesCol.appendChild(fileContainer);
        });
      } else {
        const empty = document.createElement("div");
        empty.style.padding = "0.8rem";
        empty.style.color = "#555";
        empty.style.textAlign = "center";
        empty.textContent = "No hay archivos.";
        filesCol.appendChild(empty);
      }

      const viewerCol = document.createElement("div");
      viewerCol.className = "modal-viewer";
      const viewerArea = document.createElement("div");
      viewerArea.className = "viewer-area";
      viewerArea.id = "viewer-area";

      if (primerArchivo) viewerArea.appendChild(crearViewerElemento(primerArchivo));
      else {
        const sel = document.createElement("div");
        sel.style.padding = "1rem";
        sel.style.color = "#555";
        sel.textContent = "Selecciona un archivo";
        viewerArea.appendChild(sel);
      }

      const viewerBottom = document.createElement("div");
      viewerBottom.className = "viewer-bottom";


      const leftGroup = document.createElement("div");
      if (primerArchivo) {
        const abrirLink = document.createElement("a");
        abrirLink.className = "abrir-pdf-btn";
        abrirLink.href = primerArchivo.enlace || "#";
        abrirLink.target = "_blank";
        abrirLink.rel = "noopener";
        abrirLink.textContent = "🔗 Abrir en nueva pestaña";
        leftGroup.appendChild(abrirLink);
      }


      const rightGroup = document.createElement("div");
      const githubBtn = document.createElement("a");
      githubBtn.className = "abrir-github-btn";
      githubBtn.href = GITHUB_REPO_URL;
      githubBtn.target = "_blank";
      githubBtn.rel = "noopener";
      githubBtn.textContent = "Repositorio GitHub";
      rightGroup.appendChild(githubBtn);

      viewerBottom.appendChild(leftGroup);
      viewerBottom.appendChild(rightGroup);

      viewerCol.appendChild(viewerArea);
      viewerCol.appendChild(viewerBottom);

      body.appendChild(filesCol);
      body.appendChild(viewerCol);

      modalContent.appendChild(top);
      modalContent.appendChild(body);

      modal.innerHTML = "";
      modal.appendChild(modalContent);
      modal.classList.add("mostrar");
      modal.setAttribute("aria-hidden", "false");
      disableBodyScroll();

      const fileButtons = filesCol.querySelectorAll(".file-item");
      if (fileButtons.length) fileButtons[0].classList.add("activo");

      enableArrowNavigation(filesCol);
      trapFocus(modalContent);

      escHandler = function (e) { if (e.key === "Escape") closeModal(); };
      document.addEventListener("keydown", escHandler);

      modal.addEventListener("click", function onOutsideClick(e) {
        if (e.target === modal) closeModal();
      }, { once: true });
    }


    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("mostrar")) closeModal();
    });
    modal.addEventListener("mousedown", function (e) {
      if (e.target === modal) e.preventDefault();
    });

  });

