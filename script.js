// ---------- mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}


// --------------- hero carousel images -----------------

// ---------- hero background carousel (auto, no controls) ----------
const heroSlides = document.querySelectorAll('.hero-slide');
if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
        heroSlides[currentSlide].classList.remove('is-active');
        currentSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.add('is-active');
    }, 10000);
}

// ---------- track player: one active track at a time, click to toggle ----------
const tracks = document.querySelectorAll('.track');
const audioPlayer = new Audio(); // Shared HTML5 Audio instance
let currentTrack = null;

tracks.forEach(trackEl => {
    const playBtn = trackEl.querySelector('.track-play');
    const audioSrc = trackEl.dataset.src;

    playBtn.addEventListener('click', () => {
        const wasActive = trackEl.classList.contains('is-active');

        // Reset UI state for all tracks
        tracks.forEach(t => {
            t.classList.remove('is-active');
            const btn = t.querySelector('.track-play');
            btn.textContent = '▶';
            btn.setAttribute('aria-label', `Reproducir ${t.dataset.title}`);
        });

        if (wasActive) {
            // Pause current track
            audioPlayer.pause();
        } else {
            // Activate target track
            trackEl.classList.add('is-active');
            playBtn.textContent = '❚❚';
            playBtn.setAttribute('aria-label', `Pausar ${trackEl.dataset.title}`);

            // If a new track was selected, update audio source
            if (currentTrack !== trackEl) {
                audioPlayer.src = audioSrc;
                currentTrack = trackEl;
            }

            audioPlayer.play();
        }
    });
});

// Reset UI when the track finishes playing
audioPlayer.addEventListener('ended', () => {
    if (currentTrack) {
        currentTrack.classList.remove('is-active');
        const btn = currentTrack.querySelector('.track-play');
        btn.textContent = '▶';
        btn.setAttribute('aria-label', `Reproducir ${currentTrack.dataset.title}`);
        currentTrack = null;
    }
});

// ---------- contact form (static demo — no backend wired up) ----------
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        formNote.textContent = 'Enviando...';

        const formData = new FormData(contactForm);

        // 1. Add your Web3Forms access key
        formData.append("access_key", "b87130e7-43b5-4900-820e-7c1b5cefa020");

        // 2. Extract input values
        const tipo = formData.get("tipo") || "No especificado";
        const messageText = formData.get("message") || "Sin mensaje adicional.";
        const name = formData.get("name") || "Cliente";

        // 3. Combine "tipo" and "message" into the single "message" field
        const combinedMessage = `Tipo de proyecto: ${tipo}\n\nDetalles / Mensaje:\n${messageText}`;
        formData.set("message", combinedMessage);

        // 4. Optionally delete 'tipo' so it doesn't render twice in the email summary
        formData.delete("tipo");

        // 5. Append custom subject line for your inbox email
        formData.append("subject", `Nuevo brief de ${name} (${tipo})`);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                formNote.textContent = '¡Gracias! Tu mensaje ha sido enviado correctamente.';
                contactForm.reset();
            } else {
                formNote.textContent = data.message || 'Ocurrió un error. Por favor intenta de nuevo.';
            }
        } catch (error) {
            formNote.textContent = 'Error de conexión. Inténtalo más tarde.';
            console.log(error);
        }
    });
}