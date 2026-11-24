document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================
     SUPABASE
  ========================================== */

  const SUPABASE_URL =
    "https://qpqiqhhregqaykrbzeck.supabase.co";

  const SUPABASE_KEY =
    "sb_publishable_Yb0dlxJWhqUhljGPAtGARw_3RrqPgB3";

  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


  /* ==========================================
     ELEMENTOS
  ========================================== */

  const catalogGrid =
    document.getElementById("catalogGrid");

  const artistCount =
    document.getElementById("artistCount");

  const loadingMessage =
    document.getElementById("loadingMessage");

  const emptyMessage =
    document.getElementById("emptyMessage");

  const searchInput =
    document.getElementById("searchInput");

  const countryFilter =
    document.getElementById("countryFilter");

  const categoryFilter =
    document.getElementById("categoryFilter");


  /* ADMIN */

  const adminSection =
    document.getElementById("adminSection");

  const adminGrid =
    document.getElementById("adminGrid");

  const artistForm =
    document.getElementById("artistForm");

  const artistId =
    document.getElementById("artistId");

  const artistName =
    document.getElementById("artistName");

  const artistCountry =
    document.getElementById("artistCountry");

  const artistCategory =
    document.getElementById("artistCategory");

  const artistGroup =
    document.getElementById("artistGroup");

  const artistStatus =
    document.getElementById("artistStatus");

  const saveArtistBtn =
    document.getElementById("saveArtistBtn");

  const clearFormBtn =
    document.getElementById("clearFormBtn");

  const formTitle =
    document.getElementById("formTitle");

  const formMessage =
    document.getElementById("formMessage");

  const logoutBtn =
    document.getElementById("logoutBtn");


  /* LOGIN */

  const loginModal =
    document.getElementById("loginModal");

  const loginForm =
    document.getElementById("loginForm");

  const loginEmail =
    document.getElementById("loginEmail");

  const loginPassword =
    document.getElementById("loginPassword");

  const loginMessage =
    document.getElementById("loginMessage");

  const adminAccessBtn =
    document.getElementById("adminAccessBtn");

  const closeLoginBtn =
    document.getElementById("closeLoginBtn");


  /* PERFIL */

  const profileModal =
    document.getElementById("profileModal");

  const profileContent =
    document.getElementById("profileContent");

  const closeProfileBtn =
    document.getElementById("closeProfileBtn");


  /* ==========================================
     VARIABLES
  ========================================== */

  let artists = [];

  let isAdmin = false;


  /* ==========================================
     NORMALIZAR PAIS
  ========================================== */

  function normalizeCountry(country) {

    if (!country) {
      return "Otros";
    }

    const value =
      String(country)
        .trim()
        .toLowerCase();

    if (
      value === "corea del sur" ||
      value === "south korea" ||
      value === "korea"
    ) {
      return "Corea del Sur";
    }

    if (
      value === "tailandia" ||
      value === "thailand"
    ) {
      return "Tailandia";
    }

    return "Otros";
  }


  /* ==========================================
     NORMALIZAR CATEGORIA
  ========================================== */

  function normalizeCategory(category) {

    if (!category) {
      return "Idol";
    }

    const categories = [
      "Idol",
      "Solista",
      "Actor",
      "Actriz",
      "Modelo",
      "Influencer",
      "Creador"
    ];

    const found =
      categories.find(function (item) {
        return (
          item.toLowerCase() ===
          String(category).toLowerCase()
        );
      });

    return found || category;
  }


  /* ==========================================
     ESCAPAR HTML
  ========================================== */

  function escapeHTML(value) {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* ==========================================
     INICIALES
  ========================================== */

  function getInitials(name) {

    const words =
      String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  }


  /* ==========================================
     CARGAR ARTISTAS
  ========================================== */

  async function loadArtists() {

    loadingMessage.classList.remove("hidden");

    emptyMessage.classList.add("hidden");

    catalogGrid.innerHTML = "";

    const response =
      await db
        .from("artists")
        .select("*")
        .order("name", {
          ascending: true
        });


    if (response.error) {

      console.error(
        "Error cargando artistas:",
        response.error
      );

      loadingMessage.textContent =
        "No se pudo cargar el catálogo.";

      return;
    }


    artists =
      (response.data || []).map(function (artist) {

        return {
          ...artist,

          country:
            normalizeCountry(
              artist.country
            ),

          category:
            normalizeCategory(
              artist.category
            ),

          status:
            artist.status ||
            "Disponible"
        };

      });


    loadingMessage.classList.add("hidden");

    renderCatalog();

    if (isAdmin) {
      renderAdminGrid();
    }
  }


  /* ==========================================
     FILTROS
  ========================================== */

  function getFilteredArtists() {

    const search =
      searchInput.value
        .trim()
        .toLowerCase();

    const country =
      countryFilter.value;

    const category =
      categoryFilter.value;


    return artists.filter(function (artist) {

      const matchesSearch =
        !search ||
        String(artist.name)
          .toLowerCase()
          .includes(search) ||
        String(
          artist.group_name || ""
        )
          .toLowerCase()
          .includes(search);


      const matchesCountry =
        country === "Todos" ||
        artist.country === country;


      const matchesCategory =
        category === "Todos" ||
        artist.category === category;


      return (
        matchesSearch &&
        matchesCountry &&
        matchesCategory
      );
    });
  }


  /* ==========================================
     CATALOGO PUBLICO
  ========================================== */

  function renderCatalog() {

    const filtered =
      getFilteredArtists();


    artistCount.textContent =
      `${filtered.length} ${
        filtered.length === 1
          ? "registro"
          : "registros"
      }`;


    catalogGrid.innerHTML = "";


    if (filtered.length === 0) {

      emptyMessage.classList.remove(
        "hidden"
      );

      return;
    }


    emptyMessage.classList.add(
      "hidden"
    );


    filtered.forEach(function (artist) {

      const card =
        document.createElement("article");

      card.className =
        "artist-card";


      const available =
        artist.status === "Disponible";


      card.innerHTML = `

        <div class="card-initials">
          ${escapeHTML(
            getInitials(artist.name)
          )}
        </div>

        <div class="card-category">
          ${escapeHTML(
            artist.category
          )}
        </div>

        <h3 class="card-name">
          ${escapeHTML(
            artist.name
          )}
        </h3>

        <p class="card-group">
          ${escapeHTML(
            artist.group_name || "—"
          )}
        </p>

        <p class="card-country">
          ${escapeHTML(
            artist.country
          )}
        </p>

        <div class="card-status ${
          available
            ? "status-available"
            : "status-occupied"
        }">

          ${
            available
              ? "✓ DISPONIBLE"
              : "✕ OCUPADO"
          }

        </div>
      `;


      card.addEventListener(
        "click",
        function () {
          openProfile(artist);
        }
      );


      catalogGrid.appendChild(card);
    });
  }


  /* ==========================================
     PERFIL
  ========================================== */

  function openProfile(artist) {

    const available =
      artist.status === "Disponible";


    profileContent.innerHTML = `

      <span class="section-label">
        PERFIL DE PERSONAJE
      </span>

      <div class="profile-initials">
        ${escapeHTML(
          getInitials(
            artist.name
          )
        )}
      </div>

      <h2 class="profile-name">
        ${escapeHTML(
          artist.name
        )}
      </h2>

      <div class="profile-details">

        <div class="profile-detail">

          <span>
            CATEGORÍA
          </span>

          <strong>
            ${escapeHTML(
              artist.category
            )}
          </strong>

        </div>


        <div class="profile-detail">

          <span>
            PAÍS
          </span>

          <strong>
            ${escapeHTML(
              artist.country
            )}
          </strong>

        </div>


        <div class="profile-detail">

          <span>
            GRUPO / PROYECTO
          </span>

          <strong>
            ${escapeHTML(
              artist.group_name ||
              "—"
            )}
          </strong>

        </div>


        <div class="profile-detail">

          <span>
            ESTADO
          </span>

          <strong
            class="${
              available
                ? "status-available"
                : "status-occupied"
            }"
          >

            ${
              available
                ? "✓ Disponible"
                : "✕ Ocupado"
            }

          </strong>

        </div>

      </div>
    `;


    profileModal.classList.remove(
      "hidden"
    );
  }


  function closeProfile() {

    profileModal.classList.add(
      "hidden"
    );
  }


  /* ==========================================
     LOGIN
  ========================================== */

  function openLogin() {

    loginMessage.textContent = "";

    loginMessage.className =
      "form-message";

    loginModal.classList.remove(
      "hidden"
    );
  }


  function closeLogin() {

    loginModal.classList.add(
      "hidden"
    );

    loginForm.reset();

    loginMessage.textContent = "";
  }


  /* ==========================================
     COMPROBAR ADMIN
  ========================================== */

  async function checkAdmin() {

    const sessionResponse =
      await db.auth.getSession();


    const session =
      sessionResponse.data.session;


    if (!session) {

      isAdmin = false;

      adminSection.classList.add(
        "hidden"
      );

      return false;
    }


    const adminResponse =
      await db.rpc("is_admin");


    if (
      adminResponse.error ||
      adminResponse.data !== true
    ) {

      isAdmin = false;

      adminSection.classList.add(
        "hidden"
      );

      return false;
    }


    isAdmin = true;

    adminSection.classList.remove(
      "hidden"
    );

    renderAdminGrid();

    return true;
  }


  /* ==========================================
     LOGIN
  ========================================== */

  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      loginMessage.textContent =
        "Verificando acceso...";


      loginMessage.className =
        "form-message";


      const email =
        loginEmail.value.trim();

      const password =
        loginPassword.value;


      const response =
        await db.auth.signInWithPassword({
          email: email,
          password: password
        });


      if (response.error) {

        console.error(
          response.error
        );

        loginMessage.textContent =
          "Correo o contraseña incorrectos.";

        loginMessage.className =
          "form-message error";

        return;
      }


      const admin =
        await checkAdmin();


      if (!admin) {

        await db.auth.signOut();

        loginMessage.textContent =
          "Esta cuenta no tiene permisos de administrador.";

        loginMessage.className =
          "form-message error";

        return;
      }


      closeLogin();

      adminSection.scrollIntoView({
        behavior: "smooth"
      });
    }
  );


  /* ==========================================
     GUARDAR / EDITAR
  ========================================== */

  artistForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!isAdmin) {

        showFormMessage(
          "No tienes permisos de administrador.",
          "error"
        );

        return;
      }


      saveArtistBtn.disabled = true;

      saveArtistBtn.textContent =
        "Guardando...";


      const name =
        artistName.value.trim();

      const country =
        artistCountry.value;

      const category =
        artistCategory.value;

      const groupName =
        artistGroup.value.trim();

      const status =
        artistStatus.value;


      if (!name) {

        showFormMessage(
          "Escribe el nombre del artista.",
          "error"
        );

        resetSaveButton();

        return;
      }


      const payload = {

        name: name,

        country: country,

        category: category,

        group_name:
          groupName || null,

        status: status
      };


      let response;


      /*
       EDITAR REGISTRO EXISTENTE
      */

      if (artistId.value) {

        response =
          await db
            .from("artists")
            .update(payload)
            .eq(
              "id",
              artistId.value
            );
      }


      /*
       CREAR NUEVO REGISTRO
      */

      else {

        response =
          await db
            .from("artists")
            .insert([
              payload
            ]);
      }


      if (response.error) {

        console.error(
          "ERROR SUPABASE:",
          response.error
        );

        showFormMessage(
          "No se pudo guardar el registro: " +
          response.error.message,
          "error"
        );

        resetSaveButton();

        return;
      }


      showFormMessage(
        artistId.value
          ? "Registro actualizado correctamente."
          : "Registro guardado correctamente.",
        "success"
      );


      clearForm(false);

      await loadArtists();

      renderAdminGrid();

      resetSaveButton();
    }
  );


  function resetSaveButton() {

    saveArtistBtn.disabled =
      false;

    saveArtistBtn.textContent =
      artistId.value
        ? "Guardar cambios"
        : "Guardar registro";
  }


  /* ==========================================
     MENSAJE
  ========================================== */

  function showFormMessage(
    message,
    type
  ) {

    formMessage.textContent =
      message;

    formMessage.className =
      `form-message ${type}`;
  }


  /* ==========================================
     LIMPIAR FORMULARIO
  ========================================== */

  function clearForm(
    clearMessage = true
  ) {

    artistId.value = "";

    artistName.value = "";

    artistCountry.value =
      "Corea del Sur";

    artistCategory.value =
      "Idol";

    artistGroup.value = "";

    artistStatus.value =
      "Disponible";


    formTitle.textContent =
      "Añadir personaje";


    saveArtistBtn.textContent =
      "Guardar registro";


    if (clearMessage) {

      formMessage.textContent =
        "";

      formMessage.className =
        "form-message";
    }
  }


  clearFormBtn.addEventListener(
    "click",
    function () {
      clearForm();
    }
  );


  /* ==========================================
     EDITAR
  ========================================== */

  function editArtist(id) {

    const artist =
      artists.find(function (item) {

        return String(item.id) ===
          String(id);

      });


    if (!artist) {
      return;
    }


    artistId.value =
      artist.id;


    artistName.value =
      artist.name || "";


    artistCountry.value =
      normalizeCountry(
        artist.country
      );


    artistCategory.value =
      normalizeCategory(
        artist.category
      );


    artistGroup.value =
      artist.group_name || "";


    artistStatus.value =
      artist.status ||
      "Disponible";


    formTitle.textContent =
      "Editar personaje";


    saveArtistBtn.textContent =
      "Guardar cambios";


    formMessage.textContent =
      "";


    formMessage.className =
      "form-message";


    document
      .querySelector(
        ".admin-form-card"
      )
      .scrollIntoView({
        behavior: "smooth"
      });
  }


  /* ==========================================
     ELIMINAR
  ========================================== */

  async function deleteArtist(id) {

    const artist =
      artists.find(function (item) {

        return String(item.id) ===
          String(id);

      });


    if (!artist) {
      return;
    }


    const confirmation =
      window.confirm(
        `¿Deseas eliminar a ${artist.name} del catálogo?`
      );


    if (!confirmation) {
      return;
    }


    const response =
      await db
        .from("artists")
        .delete()
        .eq("id", id);


    if (response.error) {

      console.error(
        response.error
      );

      window.alert(
        "No se pudo eliminar el registro."
      );

      return;
    }


    clearForm();

    await loadArtists();

    renderAdminGrid();
  }


  /* ==========================================
     PANEL ADMIN EN CUADROS
  ========================================== */

  function renderAdminGrid() {

    adminGrid.innerHTML = "";


    if (artists.length === 0) {

      adminGrid.innerHTML = `
        <div class="loading">
          No hay registros.
        </div>
      `;

      return;
    }


    artists.forEach(function (artist) {

      const card =
        document.createElement("div");

      card.className =
        "admin-card";


      const available =
        artist.status === "Disponible";


      card.innerHTML = `

        <div>

          <div class="admin-card-top">

            <div class="admin-initials">
              ${escapeHTML(
                getInitials(
                  artist.name
                )
              )}
            </div>

            <div
              class="admin-status ${
                available
                  ? "status-available"
                  : "status-occupied"
              }"
            >

              ${
                available
                  ? "✓ DISPONIBLE"
                  : "✕ OCUPADO"
              }

            </div>

          </div>


          <h4 class="admin-name">
            ${escapeHTML(
              artist.name
            )}
          </h4>


          <p class="admin-info">

            ${escapeHTML(
              artist.category
            )}

            ·

            ${escapeHTML(
              artist.country
            )}

            <br>

            ${
              escapeHTML(
                artist.group_name ||
                "Sin grupo / proyecto"
              )
            }

          </p>

        </div>


        <div class="admin-actions">

          <button
            type="button"
            class="small-button edit-button"
          >
            Editar
          </button>


          <button
            type="button"
            class="small-button delete-button"
          >
            Eliminar
          </button>

        </div>
      `;


      card
        .querySelector(
          ".edit-button"
        )
        .addEventListener(
          "click",
          function () {

            editArtist(
              artist.id
            );

          }
        );


      card
        .querySelector(
          ".delete-button"
        )
        .addEventListener(
          "click",
          function () {

            deleteArtist(
              artist.id
            );

          }
        );


      adminGrid.appendChild(card);
    });
  }


  /* ==========================================
     LOGOUT
  ========================================== */

  logoutBtn.addEventListener(
    "click",
    async function () {

      await db.auth.signOut();

      isAdmin = false;

      adminSection.classList.add(
        "hidden"
      );

      clearForm();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  );


  /* ==========================================
     BOTONES MODALES
  ========================================== */

  adminAccessBtn.addEventListener(
    "click",
    openLogin
  );


  closeLoginBtn.addEventListener(
    "click",
    closeLogin
  );


  closeProfileBtn.addEventListener(
    "click",
    closeProfile
  );


  loginModal
    .querySelector(
      ".modal-background"
    )
    .addEventListener(
      "click",
      closeLogin
    );


  profileModal
    .querySelector(
      ".modal-background"
    )
    .addEventListener(
      "click",
      closeProfile
    );


  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        closeLogin();

        closeProfile();
      }
    }
  );


  /* ==========================================
     FILTROS
  ========================================== */

  searchInput.addEventListener(
    "input",
    renderCatalog
  );


  countryFilter.addEventListener(
    "change",
    renderCatalog
  );


  categoryFilter.addEventListener(
    "change",
    renderCatalog
  );


  /* ==========================================
     SESION
  ========================================== */

  db.auth.onAuthStateChange(
    function () {

      setTimeout(
        function () {
          checkAdmin();
        },
        0
      );

    }
  );


  /* ==========================================
     INICIO
  ========================================== */

  loadArtists();

  checkAdmin();

});