const SUPABASE_URL = "https://qpqiqhhregqaykrbzeck.supabase.co";
const SUPABASE_KEY = "sb_publishable_Yb0dlxJWhqUhljGPAtGARw_3RrqPgB3";

if (!window.supabase?.createClient) {
  document.body.innerHTML = "<p style='color:white;padding:25px'>No se pudo cargar la conexión de CAMELOT. Recarga la página.</p>";
  throw new Error("No se encontró la biblioteca de Supabase.");
}

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = id => document.getElementById(id);

let artists = [];
let isAdmin = false;

/* CATÁLOGO INICIAL: cada integrante aparece individualmente */
const initialCatalog = [
  // COREA DEL SUR — IDOLS MASCULINOS
  ["RM","Corea del Sur","Idol masculino","BTS"],
  ["Jin","Corea del Sur","Idol masculino","BTS"],
  ["SUGA","Corea del Sur","Idol masculino","BTS"],
  ["j-hope","Corea del Sur","Idol masculino","BTS"],
  ["Jimin","Corea del Sur","Idol masculino","BTS"],
  ["V","Corea del Sur","Idol masculino","BTS"],
  ["Jungkook","Corea del Sur","Idol masculino","BTS"],

  ["Bang Chan","Corea del Sur","Idol masculino","Stray Kids"],
  ["Lee Know","Corea del Sur","Idol masculino","Stray Kids"],
  ["Changbin","Corea del Sur","Idol masculino","Stray Kids"],
  ["Hyunjin","Corea del Sur","Idol masculino","Stray Kids"],
  ["Han","Corea del Sur","Idol masculino","Stray Kids"],
  ["Felix","Corea del Sur","Idol masculino","Stray Kids"],
  ["Seungmin","Corea del Sur","Idol masculino","Stray Kids"],
  ["I.N","Corea del Sur","Idol masculino","Stray Kids"],

  ["S.Coups","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Jeonghan","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Joshua","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Jun","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Hoshi","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Wonwoo","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Woozi","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["DK","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Mingyu","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["The8","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Seungkwan","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Vernon","Corea del Sur","Idol masculino","SEVENTEEN"],
  ["Dino","Corea del Sur","Idol masculino","SEVENTEEN"],

  ["Soobin","Corea del Sur","Idol masculino","TXT"],
  ["Yeonjun","Corea del Sur","Idol masculino","TXT"],
  ["Beomgyu","Corea del Sur","Idol masculino","TXT"],
  ["Taehyun","Corea del Sur","Idol masculino","TXT"],
  ["Huening Kai","Corea del Sur","Idol masculino","TXT"],

  ["Jungwon","Corea del Sur","Idol masculino","ENHYPEN"],
  ["Heeseung","Corea del Sur","Idol masculino","ENHYPEN"],
  ["Jay","Corea del Sur","Idol masculino","ENHYPEN"],
  ["Jake","Corea del Sur","Idol masculino","ENHYPEN"],
  ["Sunghoon","Corea del Sur","Idol masculino","ENHYPEN"],
  ["Sunoo","Corea del Sur","Idol masculino","ENHYPEN"],
  ["Ni-ki","Corea del Sur","Idol masculino","ENHYPEN"],

  ["Baekhyun","Corea del Sur","Idol masculino","EXO"],
  ["Chanyeol","Corea del Sur","Idol masculino","EXO"],
  ["D.O.","Corea del Sur","Idol masculino","EXO"],
  ["Kai","Corea del Sur","Idol masculino","EXO"],
  ["Sehun","Corea del Sur","Idol masculino","EXO"],
  ["Suho","Corea del Sur","Idol masculino","EXO"],
  ["Chen","Corea del Sur","Idol masculino","EXO"],
  ["Xiumin","Corea del Sur","Idol masculino","EXO"],

  // COREA DEL SUR — IDOLS FEMENINAS
  ["Jisoo","Corea del Sur","Idol femenino","BLACKPINK"],
  ["Jennie","Corea del Sur","Idol femenino","BLACKPINK"],
  ["Rosé","Corea del Sur","Idol femenino","BLACKPINK"],
  ["Lisa","Corea del Sur","Idol femenino","BLACKPINK"],

  ["Nayeon","Corea del Sur","Idol femenino","TWICE"],
  ["Jeongyeon","Corea del Sur","Idol femenino","TWICE"],
  ["Momo","Corea del Sur","Idol femenino","TWICE"],
  ["Sana","Corea del Sur","Idol femenino","TWICE"],
  ["Jihyo","Corea del Sur","Idol femenino","TWICE"],
  ["Mina","Corea del Sur","Idol femenino","TWICE"],
  ["Dahyun","Corea del Sur","Idol femenino","TWICE"],
  ["Chaeyoung","Corea del Sur","Idol femenino","TWICE"],
  ["Tzuyu","Corea del Sur","Idol femenino","TWICE"],

  ["Karina","Corea del Sur","Idol femenino","aespa"],
  ["Giselle","Corea del Sur","Idol femenino","aespa"],
  ["Winter","Corea del Sur","Idol femenino","aespa"],
  ["Ningning","Corea del Sur","Idol femenino","aespa"],

  ["Sakura","Corea del Sur","Idol femenino","LE SSERAFIM"],
  ["Kim Chaewon","Corea del Sur","Idol femenino","LE SSERAFIM"],
  ["Huh Yunjin","Corea del Sur","Idol femenino","LE SSERAFIM"],
  ["Kazuha","Corea del Sur","Idol femenino","LE SSERAFIM"],
  ["Hong Eunchae","Corea del Sur","Idol femenino","LE SSERAFIM"],

  ["Irene","Corea del Sur","Idol femenino","Red Velvet"],
  ["Seulgi","Corea del Sur","Idol femenino","Red Velvet"],
  ["Wendy","Corea del Sur","Idol femenino","Red Velvet"],
  ["Joy","Corea del Sur","Idol femenino","Red Velvet"],
  ["Yeri","Corea del Sur","Idol femenino","Red Velvet"],

  // COREA DEL SUR — SOLISTAS
  ["IU","Corea del Sur","Solista",""],
  ["Taeyeon","Corea del Sur","Solista",""],
  ["Sunmi","Corea del Sur","Solista",""],
  ["HyunA","Corea del Sur","Solista",""],
  ["Kang Daniel","Corea del Sur","Solista",""],
  ["WOODZ","Corea del Sur","Solista",""],

  // COREA DEL SUR — ACTORES
  ["Lee Min-ho","Corea del Sur","Actor",""],
  ["Lee Jong-suk","Corea del Sur","Actor",""],
  ["Park Seo-joon","Corea del Sur","Actor",""],
  ["Kim Soo-hyun","Corea del Sur","Actor",""],
  ["Song Kang","Corea del Sur","Actor",""],
  ["Cha Eun-woo","Corea del Sur","Actor",""],
  ["Ji Chang-wook","Corea del Sur","Actor",""],
  ["Ahn Hyo-seop","Corea del Sur","Actor",""],
  ["Nam Joo-hyuk","Corea del Sur","Actor",""],
  ["Hwang In-youp","Corea del Sur","Actor",""],
  ["Byeon Woo-seok","Corea del Sur","Actor",""],
  ["Wi Ha-joon","Corea del Sur","Actor",""],
  ["Kim Seon-ho","Corea del Sur","Actor",""],
  ["Jung Hae-in","Corea del Sur","Actor",""],
  ["Lee Dong-wook","Corea del Sur","Actor",""],

  // COREA DEL SUR — ACTRICES
  ["Song Hye-kyo","Corea del Sur","Actriz",""],
  ["Park Min-young","Corea del Sur","Actriz",""],
  ["Kim Ji-won","Corea del Sur","Actriz",""],
  ["Han So-hee","Corea del Sur","Actriz",""],
  ["Kim Go-eun","Corea del Sur","Actriz",""],
  ["IU","Corea del Sur","Actriz",""],
  ["Bae Suzy","Corea del Sur","Actriz",""],
  ["Kim Yoo-jung","Corea del Sur","Actriz",""],
  ["Shin Min-a","Corea del Sur","Actriz",""],
  ["Jisoo","Corea del Sur","Actriz",""],

  // TAILANDIA — ACTORES
  ["Bright Vachirawit","Tailandia","Actor",""],
  ["Win Metawin","Tailandia","Actor",""],
  ["Dew Jirawat","Tailandia","Actor",""],
  ["Nani Hirunkit","Tailandia","Actor",""],
  ["Gemini Norawit","Tailandia","Actor",""],
  ["Fourth Nattawat","Tailandia","Actor",""],
  ["Phuwin Tangsakyuen","Tailandia","Actor",""],
  ["Pond Naravit","Tailandia","Actor",""],
  ["Joong Archen","Tailandia","Actor",""],
  ["Dunk Natachai","Tailandia","Actor",""],
  ["First Kanaphan","Tailandia","Actor",""],
  ["Khaotung Thanawat","Tailandia","Actor",""],
  ["Force Jiratchapong","Tailandia","Actor",""],
  ["Book Kasidet","Tailandia","Actor",""],
  ["Earth Pirapat","Tailandia","Actor",""],
  ["Mix Sahaphap","Tailandia","Actor",""],
  ["Off Jumpol","Tailandia","Actor",""],
  ["Gun Atthaphan","Tailandia","Actor",""],
  ["Mile Phakphum","Tailandia","Actor",""],
  ["Apo Nattawin","Tailandia","Actor",""],
  ["Bible Wichapas","Tailandia","Actor",""],
  ["Build Jakapan","Tailandia","Actor",""],
  ["Gulf Kanawut","Tailandia","Actor",""],
  ["Mew Suppasit","Tailandia","Actor",""],

  // TAILANDIA — ACTRICES
  ["Baifern Pimchanok","Tailandia","Actriz",""],
  ["Tu Tontawan","Tailandia","Actriz",""],
  ["Milk Pansa","Tailandia","Actriz",""],
  ["Love Pattranite","Tailandia","Actriz",""],
  ["Namtan Tipnaree","Tailandia","Actriz",""],
  ["Film Rachanun","Tailandia","Actriz",""],
  ["Freen Sarocha","Tailandia","Actriz",""],
  ["Becky Armstrong","Tailandia","Actriz",""],
  ["Lingling Kwong","Tailandia","Actriz",""],
  ["Orm Kornnaphat","Tailandia","Actriz",""],
  ["Engfa Waraha","Tailandia","Actriz",""],
  ["Charlotte Austin","Tailandia","Actriz",""],
  ["Mai Davika","Tailandia","Actriz",""],

  // TAILANDIA — MODELOS / CREADORES
  ["Pimchanok Luevisadpaibul","Tailandia","Modelo",""],
  ["Urassaya Sperbund","Tailandia","Modelo",""],
  ["Kanyawee Songmuang","Tailandia","Modelo",""]
].map(([name, country, category, group_name]) => ({
  name, country, category, group_name: group_name || null,
  status: "Disponible"
}));

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  })[c]);
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0,2)
    .map(word => word[0] || "").join("").toUpperCase();
}

function message(element, text, error = false) {
  element.textContent = text;
  element.style.color = error ? "#f1a5a5" : "#f0d99c";
}

function renderCatalog() {
  const search = $("searchInput").value.trim().toLowerCase();
  const country = $("countryFilter").value;
  const category = $("categoryFilter").value;

  const filtered = artists.filter(artist => {
    const name = (artist.name || "").toLowerCase();
    const group = (artist.group_name || "").toLowerCase();

    return (name.includes(search) || group.includes(search)) &&
      (!country || artist.country === country) &&
      (!category || artist.category === category);
  });

  $("artistCount").textContent =
    `${filtered.length} ${filtered.length === 1 ? "artista" : "artistas"}`;

  $("catalogGrid").innerHTML = filtered.map(artist => {
    const occupied = artist.status === "Ocupado";
    return `
      <article class="artist-card">
        <div class="artist-initial">${esc(initials(artist.name))}</div>
        <h3>${esc(artist.name)}</h3>
        <div class="artist-meta">
          ${esc(artist.country)}<br>
          ${esc(artist.category)}
          ${artist.group_name ? `<br>${esc(artist.group_name)}` : ""}
        </div>
        <span class="status ${occupied ? "occupied" : "available"}">
          ● ${occupied ? "Ocupado" : "Disponible"}
        </span>
        <button class="profile-button" data-profile="${esc(artist.id)}">VER FICHA</button>
      </article>`;
  }).join("");

  $("emptyMessage").hidden = filtered.length > 0;
  if (!filtered.length) {
    $("emptyMessage").textContent = "No encontramos artistas con esos criterios.";
  }
}

async function loadArtists() {
  $("catalogGrid").innerHTML = '<p class="loading">Cargando los registros...</p>';

  const { data, error } = await db.from("artists")
    .select("*").order("name", { ascending: true });

  if (error) {
    console.error("Error al consultar artistas:", error);
    artists = initialCatalog.map((artist, index) => ({
      ...artist, id: `local-${index}`
    }));
    renderCatalog();
    $("emptyMessage").hidden = true;
    return;
  }

  if (data && data.length) {
    artists = data;
  } else {
    // Vista inicial para visitantes mientras la administradora
    // realiza la primera carga del catálogo en Supabase.
    artists = initialCatalog.map((artist, index) => ({
      ...artist, id: `local-${index}`
    }));
  }

  renderCatalog();
  if (isAdmin) renderAdminList();
}

async function seedCatalogIfEmpty() {
  const { data, error } = await db.from("artists").select("id").limit(1);

  if (error) {
    throw new Error("No se pudo comprobar el catálogo en Supabase.");
  }

  if (data && data.length) return;

  const { error: insertError } = await db.from("artists").insert(initialCatalog);

  if (insertError) {
    throw insertError;
  }
}

function openProfile(id) {
  const artist = artists.find(item => String(item.id) === String(id));
  if (!artist) return;

  const occupied = artist.status === "Ocupado";

  $("profileDetails").innerHTML = `
    <div class="artist-initial">${esc(initials(artist.name))}</div>
    <p class="eyebrow">REGISTRO DE CAMELOT</p>
    <h2>${esc(artist.name)}</h2>
    <p class="artist-meta">
      País: ${esc(artist.country)}<br>
      Categoría: ${esc(artist.category)}<br>
      ${artist.group_name ? `Grupo o agencia: ${esc(artist.group_name)}` : ""}
    </p>
    <span class="status ${occupied ? "occupied" : "available"}">
      ● ${occupied ? "Ocupado" : "Disponible"}
    </span>`;
  $("profileModal").hidden = false;
}

function renderAdminList() {
  if (!artists.length) {
    $("adminArtistList").innerHTML =
      '<p class="empty-message">Todavía no hay artistas registrados.</p>';
    return;
  }

  $("adminArtistList").innerHTML = artists.map(artist => `
    <div class="admin-artist">
      <div>
        <strong>${esc(artist.name)}</strong>
        <small>${esc(artist.country)} · ${esc(artist.category)} · ${esc(artist.status || "Disponible")}</small>
      </div>
      <div class="admin-actions">
        <button data-edit="${esc(artist.id)}">Editar</button>
        <button class="delete" data-delete="${esc(artist.id)}">Eliminar</button>
      </div>
    </div>`).join("");
}

function resetForm() {
  $("artistForm").reset();
  $("artistId").value = "";
  $("artistStatus").value = "Disponible";
  $("formTitle").textContent = "Añadir artista";
  $("saveArtist").textContent = "Guardar artista";
  $("cancelEdit").hidden = true;
  message($("formMessage"), "");
}

function editArtist(id) {
  const artist = artists.find(item => String(item.id) === String(id));
  if (!artist) return;

  $("artistId").value = artist.id;
  $("artistName").value = artist.name;
  $("artistCountry").value = artist.country;
  $("artistCategory").value = artist.category;
  $("artistGroup").value = artist.group_name || "";
  $("artistStatus").value = artist.status || "Disponible";
  $("formTitle").textContent = "Editar artista";
  $("saveArtist").textContent = "Guardar cambios";
  $("cancelEdit").hidden = false;
  $("adminSection").scrollIntoView({ behavior: "smooth" });
}

async function saveArtist(event) {
  event.preventDefault();
  if (!isAdmin) return;

  const id = $("artistId").value;
  const artist = {
    name: $("artistName").value.trim(),
    country: $("artistCountry").value,
    category: $("artistCategory").value,
    group_name: $("artistGroup").value.trim() || null,
    status: $("artistStatus").value
  };

  $("saveArtist").disabled = true;
  message($("formMessage"), "Guardando...");

  const result = id
    ? await db.from("artists").update(artist).eq("id", id)
    : await db.from("artists").insert(artist);

  $("saveArtist").disabled = false;

  if (result.error) {
    console.error(result.error);
    message($("formMessage"), "No se pudo guardar. Revisa los permisos.", true);
    return;
  }

  resetForm();
  await loadArtists();
  message($("formMessage"), "¡Artista guardado correctamente!");
}

async function deleteArtist(id) {
  if (!isAdmin) return;
  const artist = artists.find(item => String(item.id) === String(id));
  if (!artist || !confirm(`¿Eliminar a ${artist.name} del catálogo?`)) return;

  const { error } = await db.from("artists").delete().eq("id", id);
  if (error) {
    alert("No se pudo eliminar. Revisa los permisos de administración.");
    console.error(error);
    return;
  }
  await loadArtists();
}

async function verifyAdmin(session) {
  if (!session) {
    isAdmin = false;
    $("adminSection").hidden = true;
    return false;
  }

  const { data, error } = await db.rpc("is_admin");
  if (error || data !== true) {
    isAdmin = false;
    $("adminSection").hidden = true;
    return false;
  }

  isAdmin = true;
  $("adminSection").hidden = false;
  $("loginModal").hidden = true;

  try {
    await seedCatalogIfEmpty();
    await loadArtists();
  } catch (error) {
    console.error(error);
    message($("formMessage"), "No se pudo cargar el catálogo inicial. Revisa la conexión y los permisos.", true);
    await loadArtists();
  }

  $("adminSection").scrollIntoView({ behavior: "smooth" });
  return true;
}

async function login(event) {
  event.preventDefault();
  message($("loginMessage"), "Comprobando acceso...");

  const { data, error } = await db.auth.signInWithPassword({
    email: $("loginEmail").value.trim(),
    password: $("loginPassword").value
  });

  if (error) {
    message($("loginMessage"), "No se pudo iniciar sesión. Comprueba tus datos.", true);
    return;
  }

  const allowed = await verifyAdmin(data.session);
  if (!allowed) {
    await db.auth.signOut();
    message($("loginMessage"), "Esta cuenta no tiene permisos de administración.", true);
  }
}

async function logout() {
  await db.auth.signOut();
  isAdmin = false;
  $("adminSection").hidden = true;
  $("loginModal").hidden = true;
  resetForm();
  await loadArtists();
}

function startCamelot() {
  $("searchInput").addEventListener("input", renderCatalog);
  $("countryFilter").addEventListener("change", renderCatalog);
  $("categoryFilter").addEventListener("change", renderCatalog);

  $("catalogGrid").addEventListener("click", event => {
    const button = event.target.closest("[data-profile]");
    if (button) openProfile(button.dataset.profile);
  });

  $("adminArtistList").addEventListener("click", event => {
    const edit = event.target.closest("[data-edit]");
    const remove = event.target.closest("[data-delete]");
    if (edit) editArtist(edit.dataset.edit);
    if (remove) deleteArtist(remove.dataset.delete);
  });

  $("adminAccess").addEventListener("click", async () => {
    const { data } = await db.auth.getSession();
    if (data.session && await verifyAdmin(data.session)) return;
    $("loginModal").hidden = false;
    message($("loginMessage"), "");
  });

  $("closeLogin").addEventListener("click", () => $("loginModal").hidden = true);
  $("closeProfile").addEventListener("click", () => $("profileModal").hidden = true);

  $("profileModal").addEventListener("click", event => {
    if (event.target === $("profileModal")) $("profileModal").hidden = true;
  });

  $("loginForm").addEventListener("submit", login);
  $("logoutButton").addEventListener("click", logout);
  $("artistForm").addEventListener("submit", saveArtist);
  $("cancelEdit").addEventListener("click", resetForm);

  db.auth.getSession().then(async ({ data }) => {
    if (data.session) await verifyAdmin(data.session);
  });

  loadArtists();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startCamelot);
} else {
  startCamelot();
}