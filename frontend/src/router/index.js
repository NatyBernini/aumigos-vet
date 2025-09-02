import { createRouter, createWebHistory } from 'vue-router'
import PacientesList from '../views/Pacientes/Listagem.vue'
import PacienteCadastro from '../views/Pacientes/Cadastrar.vue'
import PacienteVisualizar from '../views/Pacientes/Visualizar.vue'
import VeterinariosList from '../views/Veterinarios/Listagem.vue'
import VeterinarioCadastro from '../views/Veterinarios/Cadastrar.vue'
import ConsultaList from '../views/Consultas/Listagem.vue'
import Consultar from '../views/Consultas/Consultar.vue'
import RelatorioCadastro from '../views/Relatorios/Cadastrar.vue'
import RelatorioList from '../views/Relatorios/Listagem.vue'
import AdocaoList from '../views/Adocao/Listagem.vue'
import AdocaoCadastro from '../views/Adocao/Cadastrar.vue'
import Empresa from '../layouts/Empresa.vue'
import Login from '../layouts/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Planos from '../layouts/Planos.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/clinica',
    name: 'Clinica',
    component: Empresa,
  },
  {
    path: '/planos',
    name: 'Planos',
    component: Planos,
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: 'pacientes', name: 'Home', component: PacientesList },
      { path: 'pacientes/cadastrar', component: PacienteCadastro },
      { path: 'pacientes/visualizar/:id', name: 'PacienteVisualizar', component: PacienteVisualizar, props: true },

      { path: 'veterinarios', component: VeterinariosList },
      { path: 'veterinarios/cadastrar', component: VeterinarioCadastro },

      { path: 'consultas', component: ConsultaList },
      { path: 'consultas/consultar', component: Consultar },

      { path: 'relatorios', component: RelatorioList },
      { path: 'relatorios/cadastrar', component: RelatorioCadastro },

      { path: 'adocao', component: AdocaoList },
      { path: 'adocao/cadastrar', component: AdocaoCadastro },
    ],
  },
]

const router = createRouter({
  history: createWebHistory('/aumigos-vet/'),
   routes,
})

export default router
