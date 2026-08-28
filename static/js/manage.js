// Popup Manage - Gerenciamento
function inicializarPopupManage() {
    const manageDialog = document.querySelector('.popup-manage');
    if (!manageDialog) return;

    // Evita inicializar múltiplas vezes
    if (manageDialog.dataset.initialized) return;
    manageDialog.dataset.initialized = 'true';

    console.log('Popup Manage inicializado!');

    // Troca de tabs
    const tabButtons = manageDialog.querySelectorAll('.tab-button');
    const tabContents = manageDialog.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;

            console.log('Tab clicada:', targetTab);

            tabButtons.forEach(btn => btn.classList.remove('button-active'));
            button.classList.add('button-active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.dataset.tab === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Toggle CAPTCHA
    manageDialog.addEventListener('click', (e) => {
        const captchaBtn = e.target.closest('.captcha-toggle');
        if (captchaBtn) {
            captchaBtn.classList.toggle('captcha-active');

            if (captchaBtn.classList.contains('captcha-active')) {
                captchaBtn.innerHTML = '<span class="material-symbols-outlined">verified_user</span>Desativar CAPTCHA';
            } else {
                captchaBtn.innerHTML = '<span class="material-symbols-outlined">verified_user</span>Ativar CAPTCHA';
            }
        }
    });

    // Adicionar moderador
    manageDialog.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-mod');
        if (addBtn) {
            const boardItem = addBtn.closest('.board-item');
            const input = boardItem.querySelector('.mod-input');
            const modName = input.value.trim();

            if (modName) {
                const modList = boardItem.querySelector('.mod-list');
                const newMod = document.createElement('div');
                newMod.className = 'mod-item';
                newMod.innerHTML = `
                    <span>${modName}</span>
                    <button type="button" class="default-button remove-mod">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                `;
                modList.appendChild(newMod);
                input.value = '';
            }
        }
    });

    // Remover moderador
    manageDialog.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-mod');
        if (removeBtn) {
            const modItem = removeBtn.closest('.mod-item');
            modItem.remove();
        }
    });

    // Preview e adição de propaganda ao selecionar arquivo
    manageDialog.addEventListener('change', (e) => {
        const adInput = e.target.closest('.ad-input');
        if (adInput) {
            const file = adInput.files[0];
            if (file) {
                const boardItem = adInput.closest('.board-item');
                const adList = boardItem.querySelector('.ad-list');

                const reader = new FileReader();
                reader.onload = (e) => {
                    const newAd = document.createElement('div');
                    newAd.className = 'ad-item';
                    newAd.innerHTML = `
                    <div class="ad-preview" style="background-image: url(${e.target.result});"></div>
                    <div class="ad-details">
                        <div class="input">
                            <input type="url" class="ad-link" placeholder="Link do Banner...">
                        </div>
                        <button type="button" class="default-button remove-ad">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                `;
                    adList.appendChild(newAd);
                };
                reader.readAsDataURL(file);

                adInput.value = '';
            }
        }
    });

    // Remover propaganda
    manageDialog.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.remove-ad');
        if (removeBtn) {
            const adItem = removeBtn.closest('.ad-item');
            adItem.remove();
        }
    });

    // Preview da imagem de perfil
    const fileInput = document.getElementById('file-input-profile-manage');
    const profileImage = document.getElementById('profile-image-manage');

    if (fileInput && profileImage) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    profileImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Prevenir submit e salvar
    const form = manageDialog.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Salvando mudanças...');
            // Aqui você adiciona a lógica para enviar os dados
            if (typeof closeModal === 'function') {
                closeModal(manageDialog);
            } else {
                manageDialog.close();
            }
        });
    }
}

// Observa quando o popup é adicionado ao DOM
const observerManage = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            const hasManagePopup = Array.from(mutation.addedNodes).some(node =>
                node.nodeType === 1 && (
                    node.classList?.contains('popup-manage') ||
                    node.querySelector?.('.popup-manage')
                )
            );
            if (hasManagePopup) {
                console.log('Popup Manage detectado no DOM!');
                inicializarPopupManage();
                break;
            }
        }
    }
});

// Inicia observação assim que o módulo é carregado
observerManage.observe(document.body, { childList: true, subtree: true });

// Também tenta inicializar imediatamente caso já esteja no DOM
inicializarPopupManage();

console.log('manage.js carregado - aguardando popup-manage no DOM');