<template>
  <v-app>
    <!-- Drawer -->
    <v-navigation-drawer v-model="drawer" app :permanent="!isMobile" temporary width="250">
      <!-- Header do Drawer -->
      <div class="d-flex align-center justify-center pa-10">
        <img src="../assets/logoAumigos.png" alt="Ícone" class="menu-title-icon mt-2 mb-2" />
      </div>

      <!-- Botão de fechar só no mobile -->
      <v-btn v-if="isMobile" icon="mdi-close" variant="text" @click="drawer = false" />
      <v-divider></v-divider>

      <!-- Lista de menus -->
      <v-list density="compact" nav>
        <template v-for="(item, index) in menuItems" :key="index">
          <v-list-group v-if="item.children">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <v-list-item-icon>
                  <img :src="item.icon" alt="Ícone" class="menu-icon" />
                </v-list-item-icon>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </template>

            <v-list-item v-for="(child, i) in item.children" :key="i" :to="child.to" link nav>
              <v-list-item-icon>
                <img :src="child.icon" alt="Ícone" class="submenu-icon" />
              </v-list-item-icon>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-item v-else :to="item.to" link nav>
            <v-list-item-icon>
              <img :src="item.icon" alt="Ícone" class="menu-icon" />
            </v-list-item-icon>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>

      <!-- Rodapé -->
      <div class="menu-footer">
        <v-divider class="divider-Menu-Lateral"></v-divider>
        <span>by NatiBernini</span>
      </div>
    </v-navigation-drawer>


    <!-- AppBar -->
    <!-- AppBar -->
    <v-app-bar app dark>
      <!-- Hamburguer só aparece no mobile -->
      <v-app-bar-nav-icon v-if="isMobile" @click="drawer = !drawer" />

      <v-toolbar-title class="d-flex align-center gap-3">
        {{ appStore.userData?.pessoa?.nome_completo || 'Usuário' }}

        <!-- Menu de usuário -->
        <v-menu location="end" offset-y class="menu-usuario">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon>
              <img :src="FotoPerfil" alt="Ícone" class="menu-user-icon" />
            </v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="mb-3"><strong>Nome:</strong> {{ appStore.userData?.pessoa?.nome_completo ||
                  '-'
                }}</v-list-item-title>
                <v-list-item-subtitle class="mb-2"><strong>Email:</strong> {{ appStore.userData?.email || '-'
                }}</v-list-item-subtitle>
                <v-list-item-subtitle class="mb-2"><strong>Cargo:</strong> {{ appStore.userData?.tipo_usuario || '-'
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>


            <v-list-item to="/perfil">
              <v-list-item-title>Configurações</v-list-item-title>
            </v-list-item> <v-list-item @click="logoutUser">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-title>

    </v-app-bar>


    <v-main>
      <div :class="['container-conteudo', isMobile ? 'pa-3' : 'pa-15']">
        <router-view />
      </div>
    </v-main>

  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import iconePacientes from '../assets/icons/iconePacientes.png'
import iconListagemPaciente from '../assets/icons/iconeLista.png'
import iconAgenda from '../assets/icons/agendamento.png'
import iconCadastrarPaciente from '../assets/icons/iconeCadastro.png'

import iconeVeterinarios from '../assets/icons/iconeVeterinarios.png'
import iconeConsulta from '../assets/icons/iconeConsulta.png'
import iconeFormulario from '../assets/icons/iconeFormulario.png'
import iconeServices from '../assets/icons/iconServicesProducts.png'
import iconCaixa from '../assets/icons/iconCaixa.png'
import FotoPerfil from '../assets/icons/avatar-do-usuario.png'

import { useAppStore, usePersistentStore } from '@/modules/commons/store';
import { useRouter } from 'vue-router';

const appStore = useAppStore();

const logoutUser = () => {
  appStore.userData = null;
  appStore.isAuthorized = false;
};

const drawer = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 960
  drawer.value = !isMobile.value
}

// 🔹 Agora cada child também pode ter roles
const allMenuItems = [
  {
    title: 'Pacientes',
    icon: iconePacientes,
    roles: ['admin_clinica', 'veterinario'],
    children: [
      { title: 'Listagem', to: '/pacientes', icon: iconListagemPaciente, roles: ['admin_clinica', 'veterinario'] },
      { title: 'Cadastrar', to: '/pacientes/cadastrar', icon: iconCadastrarPaciente, roles: ['admin_clinica', 'veterinario'] },
    ],
  },
  {
    title: 'Veterinários',
    icon: iconeVeterinarios,
    roles: ['admin_clinica', 'veterinario'],
    children: [
      { title: 'Listagem', to: '/veterinarios', icon: iconListagemPaciente, roles: ['admin_clinica', 'veterinario'] },
      { title: 'Cadastrar', to: '/veterinarios/cadastrar', icon: iconCadastrarPaciente, roles: ['admin_clinica'] },
    ],
  },
  {
    title: 'Consultas',
    icon: iconeConsulta,
    roles: ['admin_clinica', 'veterinario', 'atendente'],
    children: [
      { title: 'Agenda', to: '/consultas', icon: iconListagemPaciente, roles: ['admin_clinica', 'veterinario'] },
      { title: 'Consultar', to: '/consultas/consultar', icon: iconCadastrarPaciente, roles: ['admin_clinica', 'veterinario'] },
    ],
  },
  {
    title: 'Relatórios',
    icon: iconeFormulario,
    to: '/relatorios',
    roles: ['admin_clinica', 'veterinario'],
  },
  {
    title: 'Serviços',
    icon: iconeServices,
    roles: ['admin_clinica'],
    children: [
      { title: 'Listagem', to: '/servicos', icon: iconListagemPaciente, roles: ['admin_clinica'] },
      { title: 'Cadastrar', to: '/servicos/cadastrar', icon: iconCadastrarPaciente, roles: ['admin_clinica'] },
    ],
  },
  {
    title: 'Caixa',
    icon: iconCaixa,
    to: '/caixa',
    roles: ['admin_clinica', 'atendente'],
  },
]

const menuItems = computed(() => {
  const role = appStore.userData?.tipo_usuario
  if (!role) return [] // nenhum menu se não tiver role

  return allMenuItems
    .filter(item => item.roles?.includes(role))
    .map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => child.roles?.includes(role))
        return { ...item, children: filteredChildren }
      }
      return item
    })
})


onMounted(() => {
  checkMobile()
  window.addEventListener("resize", checkMobile)
})
</script>


<style lang="scss">
* {
  font-family: 'Poppins', sans-serif !important;
}

.v-icon--size-default {
  font-size: 20px !important;
}

.title-page {
  font-size: 26px;
  font-weight: 500;
  color: #434343;
}

.subtitle-padrao {
  font-size: 20px;
  font-weight: 500;
  color: #434343;
}

.container-conteudo {
  padding: 30px;
  padding-left: 0;
  padding-right: 0;
}

.v-navigation-drawer {
  background: rgb(245, 245, 245) !important;
  border: none !important;
  box-shadow: rgba(0, 0, 0, 0.12) 1px 2px 20px 0px !important;
  position: relative;
  padding-bottom: 70px;

  .divider-Menu-Lateral {
    margin-top: 20px;
    margin-bottom: 20px !important;
  }

  .title-menu-lateral {
    padding-top: 20px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .v-list-group {
    margin-bottom: 15px;
  }

  .v-list-item__content {
    display: flex !important;
    align-items: center !important;
  }

  .v-list-group .v-list-item .v-list-item-title {
    font-size: 15px !important;
  }

  .v-list-group__items .v-list-item {
    margin-inline-start: calc(10px + var(--indent-padding)) !important;
    padding-inline-start: 15px !important;
    border-radius: 10px;

    .v-list-item-title {
      font-size: 14px !important;
    }
  }

  .v-list-item--active {
    color: #ff8200;
  }

  .menu-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
    margin-right: 10px;
  }

  .menu-title-icon {
    width: 180px;
    height: auto;
    object-fit: contain;
  }

  .submenu-icon {
    display: flex !important;
    align-items: center;
    width: 18px;
    height: 18px;
    object-fit: contain;
    margin-right: 8px;
  }

  .menu-footer {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #888;
    padding-bottom: 10px;
  }
}

.menu-user-icon {
  width: 40px;
  border-radius: 50%;
}

.v-toolbar {
  box-shadow: none !important;
  border-bottom: 1px solid #E8E8E8 !important;
}

.v-toolbar-title {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  flex-wrap: nowrap;
  padding-right: 20px;

  .v-toolbar-title__placeholder {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}

.container-text-area {
  padding: 0 !important;
}

.v-btn.btn-padrao {
  box-shadow: none !important;
  background: #EFEFEF !important;
  border-radius: 10px !important;
  color: #2e2e2e !important;
  font-size: 13px !important;
  padding-left: 15px;
  padding-right: 15px;

  &:hover {
    background: #ff8200 !important;
    color: #fff !important;
  }
}


.v-btn--disabled.v-btn--variant-elevated .v-btn__overlay {
  opacity: 0 !important;
}

button.v-btn.v-btn--disabled.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-elevated.me-4.btn-padrao {
  background: #ededed !important;
  color: #a8a8a8 !important;
  opacity: 1;
}

.container-btn {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.v-radio-group {
  margin-top: 10px;
}

.msg-auxiliar {
  color: #565656;
  font-size: 13px;
}

.sub-page {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #565656;
  display: flex;
  align-items: center;
  gap: 3px;

}

.menu-sub-icon {
  width: 20px;
}


.v-slide-group {
  border-bottom: 1px solid #ABABAB;
}

.v-tab__slider {
  background: #ff8200 !important;
  border-radius: 5px;
  height: 3px !important;
}

.v-btn {
  text-transform: initial;
}

.v-tab-item--selected .v-btn__content {
  color: #ff8200;
}

.v-card {
  box-shadow: none !important;

  .v-card-title {
    display: flex !important;
    justify-content: space-between;
    color: #2e2e2e;
    font-size: 14px;
    font-weight: 600;
    flex-direction: row;
    flex-wrap: wrap;
    text-wrap: auto;
    align-items: center;

    .v-btn {
      box-shadow: none !important;
      min-width: auto;
      padding: 0;
    }
  }
}

.v-row,
.v-col-12 {
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.row-info-basicas {
  gap: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.row-info-radios {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 20px;
}

thead {
  background: #FFE6CC;

  th {
    height: 50px !important;
    border-bottom: none !important;

    span {
      color: #4e4e4e;
      font-weight: 600;
    }
  }

  tr>th:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    overflow: hidden;
  }

  tr>th:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;
  }
}

.btn-pagination.v-btn--icon.v-btn--density-default {
  width: 30px !important;
  height: 30px !important;
  --v-btn-size: 15px;
}

.container-pagination {
  gap: 12px;
  display: flex;
}

.custom-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  flex-wrap: wrap;
  gap: 1rem;

  >span {
    font-weight: 500;
  }
}

.row-padrao {
  gap: 20px;
  margin: 0;
}

.card-informativo {
  padding: 15px;
  background-color: #FFE6CC;
  border-radius: 10px;
}

.menu-usuario {
  .v-overlay__content {
    border-radius: 10px;
  }
}

.v-alert {
  border-radius: 4px;
  position: fixed !important;
  right: 40px;
  top: 112px;
  max-width: 480px;
  z-index: 100;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  display: flex !important;
  flex-wrap: wrap !important;
  white-space: pre-line;

  &.bg-error {
    color: #5A5A5A !important;
    background: rgb(255, 227, 227) !important;
    border-left: 5px solid #D14A4A !important;
  }

  &.bg-info {
    border-left: 5px solid #6A8FD2 !important;
    background: #dee6f6 !important;
    color: #5A5A5A !important;
  }

  &.bg-success {
    border-left: 5px solid #83b940 !important;
    background: #cef79b !important;
    color: #5A5A5A !important;
  }

  .v-alert__prepend {
    display: none !important;
  }

}


.info-box {
  background: #fafafa;
  border-radius: 12px;
  padding: 20px;
  min-width: 300px;
  max-width: 725px;

  .input-text-container {
    margin-bottom: 35px !important;
  }

  .span-info-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
