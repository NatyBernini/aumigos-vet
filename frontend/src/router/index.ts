import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import PacientesList from '../views/Pacientes/Listagem.vue'
import PacienteCadastro from '../views/Pacientes/Cadastrar.vue'
import VeterinariosList from '../views/Veterinarios/Listagem.vue'
import VeterinarioCadastro from '../views/Veterinarios/Cadastrar.vue'
import ConsultaList from '../views/Consultas/Listagem.vue'
import Consultar from '../views/Consultas/Consultar.vue'
import RelatorioList from '../views/Relatorios/Listagem.vue'
import Empresa from '../layouts/Empresa.vue'
import Login from '../layouts/Login.vue'
import MainLayout from '../layouts/MainLayout.vue'
import Planos from '../layouts/Planos.vue'
import ProdutoCadastrar from '../views/Financeiro/Produtos/Cadastrar.vue'
import ProdutoListagem from '../views/Financeiro/Produtos/Listagem.vue'
import CaixaListagem from '../views/Financeiro/Caixa/Listagem.vue'
import CaixaPagamento from '../views/Financeiro/Caixa/Pagamento.vue'
import Perfil from '../views/User/Perfil.vue'

import { usePersistentStore } from '@/modules/commons/store'
import { useAppStore } from '@/modules/commons/store/appStore/app'

interface CustomRouteMeta {
  requiresAuth?: boolean
  roles?: string[]
}

declare module 'vue-router' {
  interface RouteMeta extends CustomRouteMeta { }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/clinica',
    name: 'Clinica',
    component: Empresa,
    meta: { requiresAuth: true, roles: ['admin_clinica'] },
  },
  {
    path: '/planos',
    name: 'Planos',
    component: Planos,
    meta: { requiresAuth: true, roles: ['admin_clinica'] },
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      // Pacientes
      { path: 'pacientes', name: 'Home', component: PacientesList, meta: { requiresAuth: true, roles: ['admin_clinica', 'veterinario'] } },
      { path: 'pacientes/cadastrar/:id?', name: 'PacienteCadastrar', component: PacienteCadastro, meta: { requiresAuth: true, roles: ['admin_clinica', 'veterinario'] } },
 
      // Veterinários
      { path: 'veterinarios', component: VeterinariosList, meta: { requiresAuth: true, roles: ['admin_clinica', 'veterinario'] } },
      { path: 'veterinarios/cadastrar', component: VeterinarioCadastro, meta: { requiresAuth: true, roles: ['admin_clinica'] } },

      // Consultas
      { path: 'consultas', component: ConsultaList, meta: { requiresAuth: true, roles: ['admin_clinica', 'veterinario'] } },
      { path: 'consultas/consultar', name: 'Consultar', component: Consultar, meta: { requiresAuth: true, roles: ['admin_clinica', 'veterinario'] } },

      // Relatórios
      { path: 'relatorios', component: RelatorioList, meta: { requiresAuth: true, roles: ['admin_clinica', 'veterinario'] } },

      // Serviços (Produtos/Financeiro)
      { path: 'servicos', component: ProdutoListagem, meta: { requiresAuth: true, roles: ['admin_clinica'] } },
      { path: 'servicos/cadastrar', component: ProdutoCadastrar, meta: { requiresAuth: true, roles: ['admin_clinica'] } },

      // Caixa
      { path: 'caixa', component: CaixaListagem, meta: { requiresAuth: true, roles: ['admin_clinica', 'atendente'] } },
      { path: 'caixa/pagamento/:id', name: 'Pagamento', component: CaixaPagamento, props: true, meta: { requiresAuth: true, roles: ['admin_clinica', 'atendente'] } },
    ],
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: Perfil,
    meta: { requiresAuth: true, roles: ['admin_clinica', 'atendente', 'veterinario'] },
  },
]

const router = createRouter({
  history: createWebHistory('/aumigos-vet/'),
  routes,
})

// 🔐 Proteção global de rotas
router.beforeEach(async (to, from, next) => {
  const persistentStore = usePersistentStore()
  const appStore = useAppStore()

  if (to.meta.requiresAuth) {
    if (!persistentStore.jwtToken) {
      appStore.logout()
      return next({ name: 'Login' })
    }

    if (!appStore.userData) {
      try {
        await appStore.fetchUserData()
      } catch (error) {
        appStore.logout()
        return next({ name: 'Login' })
      }
    }

    if (to.meta.roles) {
      const tipoUsuario = appStore.userData?.tipo_usuario
      if (!tipoUsuario || !to.meta.roles.includes(tipoUsuario)) {
        return next({ path: '/caixa' })
      }
    }


    return next()
  }

  next()
})

export default router
