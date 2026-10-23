(function () {
  "use strict";

  const DB_NAME = "cmp-public-offline";
  const STORE_NAME = "sections";
  const IMAGE_CACHE = "cmp-public-images-v1";
  const content = document.getElementById("offline-content");
  const footerContact = document.getElementById("footer-contact");
  const routes = new Set(["/", "/quienes-somos", "/servicios", "/directorio-medico"]);
  const pathname = location.pathname.replace(/\/$/, "") || "/";
  const route = routes.has(pathname) ? pathname : "/";

  document.querySelectorAll("[data-route]").forEach((link) => {
    if (link.getAttribute("data-route") === route) link.setAttribute("aria-current", "page");
  });

  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = String(value);
    return node;
  }

  function append(parent, ...children) {
    children.forEach((child) => parent.appendChild(child));
    return parent;
  }

  function updated(snapshot) {
    if (!snapshot) return "Aún no se ha guardado esta sección.";
    const date = new Date(snapshot.updatedAt);
    return Number.isNaN(date.getTime())
      ? "Fecha de actualización no disponible."
      : "Última actualización guardada: " + new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" }).format(date);
  }

  function sectionHead(title, snapshot, description) {
    const head = el("div", "section-head");
    head.appendChild(el("h2", "", title));
    if (description) head.appendChild(el("p", "", description));
    if (snapshot !== null) head.appendChild(el("p", "meta", updated(snapshot)));
    return head;
  }

  function empty() {
    return append(
      el("section", "empty-state"),
      el("h2", "", "Aún no disponible sin conexión"),
      el("p", "", "Visita esta sección con internet para guardar su información pública en este dispositivo."),
    );
  }

  function hero(kicker, title, description, source) {
    const section = el("section", "hero");
    const background = el("img");
    background.src = source;
    background.alt = "";
    const body = append(el("div"), el("span", "eyebrow", kicker), el("h1", "", title), el("p", "", description));
    return append(section, background, body);
  }

  function paragraph(value) {
    return el("p", "", value || "Información no disponible.");
  }

  function panel(title, value) {
    return append(el("section", "text-panel"), el("h2", "", title), paragraph(value));
  }

  function contactList(company) {
    const list = el("dl", "contact-list");
    for (const [label, value] of [
      ["Dirección", company.direccion],
      ["Teléfono", company.telefono],
      ["Correo electrónico", company.correo],
      ["Horario de atención", company.horario],
    ]) {
      if (!value) continue;
      list.appendChild(append(el("div"), el("dt", "", label), el("dd", "", value)));
    }
    return list;
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME, { keyPath: "key" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function readSnapshots() {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).getAll();
      request.onsuccess = () => resolve(Object.fromEntries(request.result.map((item) => [item.key, item])));
      request.onerror = () => reject(request.error);
      transaction.oncomplete = () => database.close();
    });
  }

  async function image(source, fallback, alt) {
    const node = el("img");
    node.alt = "Imagen ilustrativa";
    node.loading = "lazy";
    node.src = fallback;
    if (!source) return node;
    if (source.startsWith("/") && !source.startsWith("//")) {
      node.src = source;
      node.alt = alt;
      node.onerror = () => { node.onerror = null; node.src = fallback; };
      return node;
    }
    try {
      if (!("caches" in window)) return node;
      const response = await (await caches.open(IMAGE_CACHE)).match(source);
      if (!response) return node;
      const blob = await response.blob();
      if (!blob.type.startsWith("image/")) return node;
      const url = URL.createObjectURL(blob);
      node.src = url;
      node.alt = alt;
      node.onload = () => URL.revokeObjectURL(url);
      node.onerror = () => { URL.revokeObjectURL(url); node.src = fallback; node.alt = "Imagen ilustrativa"; };
    } catch { /* Mantener la imagen local de sustitución. */ }
    return node;
  }

  async function cards(items, kind) {
    const grid = el("div", "cards");
    for (const item of items) {
      const card = el("article", kind === "doctor" ? "card doctor" : "card");
      const fallback = kind === "doctor" ? "/no_imagen_uwvduy.png" : "/headerimg.png";
      const title = kind === "doctor" ? item.nombre : item.titulo;
      card.appendChild(await image(item.imagen, fallback, item.imagen ? "Imagen de " + title : "Imagen ilustrativa de " + title));
      const body = el("div", "card-body");
      append(body, el("h3", "", title), paragraph(kind === "doctor" ? item.especialidad || "Especialidad no disponible" : item.descripcion));
      card.appendChild(body);
      grid.appendChild(card);
    }
    return grid;
  }

  function links() {
    const grid = el("div", "cards two");
    for (const [title, href, description] of [
      ["Quiénes somos", "/quienes-somos", "Historia, filosofía y contacto"],
      ["Servicios", "/servicios", "Atención y servicios disponibles"],
      ["Directorio médico", "/directorio-medico", "Conoce a los especialistas"],
    ]) {
      const link = el("a", "card card-link");
      link.href = href;
      link.appendChild(append(el("div", "card-body"), el("h2", "", title), paragraph(description)));
      grid.appendChild(link);
    }
    return grid;
  }

  function renderFooter(company) {
    if (company) footerContact.replaceChildren(el("h2", "", "Contacto"), contactList(company));
  }

  async function render(snapshots) {
    const company = snapshots.empresa?.data;
    renderFooter(company);
    content.replaceChildren();

    if (route === "/") {
      document.title = "Inicio sin conexión | Centro Médico Pichardo";
      content.appendChild(hero("Centro Médico Pichardo", "Cuidado cercano para tu familia", "Consulta las secciones públicas que quedaron guardadas en este dispositivo.", "/headerquienesomos.png"));
      const feature = el("section", "split text-panel");
      const portrait = el("img");
      portrait.src = "/Pichardo.jpg";
      portrait.alt = "Dr. Francisco Javier Moreno Pichardo";
      const intro = append(el("div"), el("span", "eyebrow", "Atención pediátrica"), el("h2", "", "Dr. Francisco Javier Moreno Pichardo"), paragraph("Un espacio de cuidado pediátrico cercano a las familias de Huejutla."));
      content.appendChild(append(feature, portrait, intro));
      append(content, sectionHead("Explora sin conexión", null, "Estas secciones muestran la última información pública guardada."), links());
      if (company) append(content, sectionHead("Visítanos", snapshots.empresa), append(el("section", "text-panel"), contactList(company)));
      return;
    }

    if (route === "/quienes-somos") {
      document.title = "Quiénes somos sin conexión | Centro Médico Pichardo";
      content.appendChild(hero("Quiénes somos", "Cuidado pediátrico con propósito", "Historia, principios y contacto del Centro Médico Pichardo.", "/headerquienesomos.png"));
      const about = snapshots.nosotros?.data;
      content.appendChild(sectionHead("Nuestra historia y filosofía", snapshots.nosotros));
      if (!about) content.appendChild(empty());
      else {
        const illustration = await image(about.imagen, "/pediatric-illustration.png", "Imagen de la historia del Centro Médico Pichardo");
        illustration.className = "about-image";
        content.appendChild(illustration);
        append(content, panel("Nuestra historia", about.nuestraHistoria), panel("Nuestro compromiso", about.compromiso), panel("Misión", about.mision), panel("Visión", about.vision));
        const values = append(el("section", "text-panel"), el("h2", "", "Nuestros valores"));
        const list = el("ul", "pill-list");
        for (const value of about.valores || []) list.appendChild(el("li", "", value));
        values.appendChild(list);
        content.appendChild(values);
      }
      content.appendChild(sectionHead("Contacto y ubicación", snapshots.empresa));
      content.appendChild(company ? append(el("section", "text-panel"), contactList(company)) : empty());
      return;
    }

    const isDoctor = route === "/directorio-medico";
    const key = isDoctor ? "medicos" : "servicios";
    document.title = (isDoctor ? "Directorio médico" : "Servicios") + " sin conexión | Centro Médico Pichardo";
    content.appendChild(hero(isDoctor ? "Directorio médico" : "Servicios", isDoctor ? "Conoce a nuestros especialistas" : "Servicios para tu familia", isDoctor ? "Consulta nombres, especialidades y fotografías guardadas." : "Consulta títulos, descripciones e imágenes guardadas.", isDoctor ? "/headermedico.png" : "/headerimg.png"));
    content.appendChild(sectionHead(isDoctor ? "Equipo médico" : "Nuestros servicios", snapshots[key]));
    if (!snapshots[key]) content.appendChild(empty());
    else if (!snapshots[key].data.length) content.appendChild(panel("Sin resultados", "No hay elementos publicados en la última actualización."));
    else {
      const grid = await cards(snapshots[key].data, isDoctor ? "doctor" : "service");
      if (!isDoctor) {
        const search = el("div", "offline-search");
        const label = el("label", "", "Buscar en servicios guardados");
        const input = el("input");
        const result = el("p", "meta");
        input.id = "offline-service-search";
        input.type = "search";
        input.placeholder = "Buscar servicio";
        label.htmlFor = input.id;
        result.setAttribute("role", "status");
        result.setAttribute("aria-live", "polite");
        input.setAttribute("aria-describedby", "offline-service-result");
        result.id = "offline-service-result";
        const articles = Array.from(grid.children);
        input.addEventListener("input", () => {
          const term = input.value.trim().toLocaleLowerCase("es-MX");
          let count = 0;
          articles.forEach((article, index) => {
            const item = snapshots.servicios.data[index];
            const title = (item.titulo || "").toLocaleLowerCase("es-MX");
            const description = (item.descripcion || "").toLocaleLowerCase("es-MX");
            const visible = title.includes(term) || description.includes(term);
            article.hidden = !visible;
            if (visible) count += 1;
          });
          result.textContent = `${count} ${count === 1 ? "servicio encontrado" : "servicios encontrados"} en los datos guardados.`;
        });
        append(search, label, input, result);
        content.appendChild(search);
      }
      content.appendChild(grid);
    }
  }

  readSnapshots().then(render).catch(() => {
    content.replaceChildren(
      hero("Sin conexión", "Consulta pública", "El almacenamiento de este navegador no está disponible. Visita el sitio con internet para consultar la información.", "/headerquienesomos.png"),
      empty(),
    );
  });
})();
