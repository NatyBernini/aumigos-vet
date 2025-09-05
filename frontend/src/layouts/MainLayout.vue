<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app permanent width="250">
      <v-list density="compact" nav>
        <v-list-item>
          <v-list-item-title class="text-h6 title-menu-lateral">
            <v-list-item-icon>
              <img src="../assets/logoAumigos.png" alt="Ícone" class="menu-title-icon mt-10 mb-10" />
            </v-list-item-icon>
          </v-list-item-title>
        </v-list-item>

        <template v-for="(item, index) in menuItems" :key="index">
          <!-- Se tiver filhos, usa v-list-group -->
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

          <!-- Se não tiver filhos, vai direto para a rota -->
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

    <v-app-bar app dark>
      <v-toolbar-title>Natália Bernini
        <img src="../assets/icons/fotoPerfil.jpg" alt="Ícone" class="menu-user-icon" /></v-toolbar-title>
    </v-app-bar>

    <v-main>
      <div class="container-conteudo pa-15"><router-view /></div>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

import iconePacientes from '../assets/icons/iconePacientes.png'
import iconListagemPaciente from '../assets/icons/iconeLista.png'
import iconCadastrarPaciente from '../assets/icons/iconeCadastro.png'

import iconeVeterinarios from '../assets/icons/iconeVeterinarios.png'
import iconeConsulta from '../assets/icons/iconeConsulta.png'
import iconeAdocaoGato from '../assets/icons/iconeAdocaoGato.png'
import iconeFormulario from '../assets/icons/iconeFormulario.png'

const drawer = ref(true)

const menuItems = [
  {
    title: 'Pacientes',
    icon: iconePacientes,
    children: [
      { title: 'Listagem', to: '/pacientes', icon: iconListagemPaciente },
      { title: 'Cadastrar', to: '/pacientes/cadastrar', icon: iconCadastrarPaciente },
    ],
  },
  {
    title: 'Veterinários',
    icon: iconeVeterinarios,
    children: [
      { title: 'Listagem', to: '/veterinarios', icon: iconListagemPaciente },
      { title: 'Cadastrar', to: '/veterinarios/cadastrar', icon: iconCadastrarPaciente },
    ],
  },
  {
    title: 'Consultas',
    icon: iconeConsulta,
    children: [
      { title: 'Listagem', to: '/consultas', icon: iconListagemPaciente },
      { title: 'Consultar', to: '/consultas/consultar', icon: iconCadastrarPaciente },
      { title: 'Agendar', to: '/consultas/agendar', icon: iconCadastrarPaciente },
    ],
  },
  {
    title: 'Adoção',
    icon: iconeAdocaoGato,
    children: [
      { title: 'Listagem', to: '/adocao', icon: iconListagemPaciente },
      { title: 'Cadastrar', to: '/adocao/cadastrar', icon: iconCadastrarPaciente },
    ],
  },
  {
    title: 'Relatórios',
    icon: iconeFormulario,
    to: '/relatorios'
  },
]

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
    color: #ff6a00;
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
    background: #FF8A33 !important;
    color: #fff !important;
  }
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
  margin-bottom: 40px;
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
  background: #FF6A00 !important;
  border-radius: 5px;
  height: 3px !important;
}

.v-btn {
  text-transform: initial;
}

.v-tab-item--selected .v-btn__content {
  color: #FF6A00;
}

.v-card {
  box-shadow: none !important;
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
</style>
