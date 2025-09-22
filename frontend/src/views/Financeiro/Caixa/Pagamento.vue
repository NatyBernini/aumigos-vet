<template>
    <v-card>
        <p class="title-page">Caixa - Faturamento
            <img src="/./src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
        </p>

        <p class="sub-page">Serviços / <span class="aba-atual">Caixa</span>
            <img src="/./src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
        </p>

        <v-tabs v-model="tab">
            <v-tab value="one">Atendimentos Pendentes</v-tab>
        </v-tabs>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one" class="pt-5">
                    <p class="subtitle-padrao mb-3">Informações do Paciente</p>
                    <inputText label="Nome do Paciente" type="text" required
                        v-model:valueInput="textInputs[`input-nome`]" id="input-nome" style="max-width: 350px;"
                        :max-length="0" :disabled="true" />
                    <inputText label="Nome do Responsável" type="text" required
                        v-model:valueInput="textInputs[`input-responsavel`]" id="input-responsavel" style="max-width: 350px;"
                        :max-length="0" :disabled="true" />
                        
                    <p class="subtitle-padrao mt-10 mb-3">Resumo da Consulta</p>
                    <v-card  class="card-resumo-consulta">
                        <v-card-text>
                            <v-table>
                                <tbody>
                                    <tr v-for="(item, index) in produtosConsulta" :key="index">
                                        <td>{{ item.nome }}</td>
                                        <td class="text-center">{{ item.qtd }}</td>
                                        <td class="text-right">{{ formatCurrency(item.total) }}</td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>

                    <p class="subtitle-padrao mt-10">Produtos Extras</p>
                    <v-row class="ma-0 mt-5 mb-5 row-btn-produtos">
                        <v-btn class="btn-padrao" @click="dialog = true">
                            Adicionar Produto
                        </v-btn>
                        <v-btn v-if="produtosExtras.length" class="btn-padrao" type="submit" @click=" produtosExtras = []">
                            Remover Todos os Produtos
                        </v-btn>
                    </v-row>

                    <v-card class="card-resumo-consulta" v-if="produtosExtras.length">
                        <v-card-text>
                            <v-table>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th class="text-center">Qtd</th>
                                        <th class="text-right">Total</th>
                                        <th class="text-center">Remover</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in produtosExtras" :key="index">
                                        <td>{{ item.nome }}</td>
                                        <td class="text-center">{{ item.qtd }}</td>
                                        <td class="text-right">{{ formatCurrency(item.total) }}</td>
                                        <td class="text-center">
                                            <v-btn icon="mdi-close" size="small" variant="tonal"
                                                @click="removeProduto(item)" />
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>
                    <p class="title-page mt-10">
                        TOTAL: {{ formatCurrency(totalGeral) }}
                    </p>


                    <p class="subtitle-padrao mt-5">Forma de Pagamento</p>



                    <!-- Selecionar parcelas apenas se for parcelado -->
                    <v-row class="mt-1">
                        <v-chip-group v-model="formaPagamento" multiple class="my-2">
                            <v-chip v-for="tipo in tiposPagamento" :key="tipo" :value="tipo" color="#FF6A00"
                                variant="tonal">
                                {{ tipo }}
                            </v-chip>
                        </v-chip-group>
                        <combobox v-if="formaPagamento.includes('Parcelado')" v-model="parcelas"
                            :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                            :extra-items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]" label="Parcelas*" variant="outlined"
                            id="parcelas" :isRequired="false" :isMultipleSelect="false"
                            class="container-combobox-padrao mt-4 mb-4" placeholder="Parcelas"
                            style="max-width: 30px;" />
                    </v-row>
                </v-tabs-window-item>
            </v-tabs-window>


            <div class="container-btn mt-5">
                <v-btn class="btn-padrao"  :to="{ path: '/caixa' }">
                    Cancelar
                </v-btn>
                <v-btn class="me-4 btn-padrao" type="submit">Registrar Pagamento</v-btn>
            </div>
        </v-card-text>

        <v-dialog v-model="dialog" max-width="700px">
            <v-card>
                <v-card-title>
                    <span class="text-h6">Adicionar Produto</span>
                </v-card-title>
                <v-card-text>
                    <!-- Campo de pesquisa -->
                    <v-text-field v-model="search" label="Pesquisar por nome ou categoria"
                        prepend-inner-icon="mdi-magnify" clearable />

                    <!-- Lista de produtos -->
                    <v-table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th class="text-center">Preço</th>
                                <th class="text-center">Qtd</th>
                                <th class="text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(produto, i) in filteredProducts" :key="i">
                                <td>{{ produto.nome }}</td>
                                <td>{{ produto.categoria }}</td>
                                <td class="text-center">{{ formatCurrency(produto.preco) }}</td>
                                <td class="text-center">
                                    <v-text-field v-model.number="quantidades[produto.nome]" type="number" min="1"
                                        density="compact" style="max-width: 70px" />
                                </td>
                                <td class="text-center">
                                    <v-btn icon="mdi-plus" size="small" variant="tonal" color="primary"
                                        @click="addProduto(produto)" />
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Mensagem de feedback -->
                    <v-snackbar v-model="snackbar" timeout="2000" color="success">
                        Produto adicionado!
                    </v-snackbar>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn text @click="dialog = false">Fechar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, reactive, onMounted } from "vue"
import { formatCurrency } from "@/utils/formaUtils"

// COMPONENTES
import combobox from "@/components/select.vue"
import inputText from "@/components/inputText.vue"

const tab = ref(null)
const dialog = ref(false)
const search = ref("")
const snackbar = ref(false)

// interface
interface ItemConsulta {
    nome: string
    qtd: number
    total: number
}
interface Produto {
    nome: string
    categoria: string
    preco: number
}

const produtosConsulta = ref<ItemConsulta[]>([
    { nome: "Vacina Antirrábica", qtd: 1, total: 80 },
    { nome: "Vermífugo", qtd: 2, total: 60 },
    { nome: "Exame de Sangue", qtd: 1, total: 120 },
    { nome: "Consulta", qtd: 1, total: 120 },
])

const produtosExtras = ref<ItemConsulta[]>([])

// Lista de produtos disponíveis
const produtos = ref<Produto[]>([
    { nome: "Ração Premium", categoria: "Alimento", preco: 200 },
    { nome: "Coleira Anti-Pulgas", categoria: "Acessório", preco: 80 },
    { nome: "Vacina Gripe Canina", categoria: "Vacina", preco: 100 },
    { nome: "Sachê KelCat", categoria: "Alimento", preco: 2.89 },
    { nome: "Banho e Tosa", categoria: "Serviço", preco: 50 },
])

// Quantidades temporárias no modal
const quantidades = reactive<Record<string, number>>({})

const tiposPagamento = ["Crédito", "Débito", "Dinheiro", "Pix", "Parcelado"]
const formaPagamento = ref<string[]>([])
const parcelas = ref<string | undefined>()
const textInputs = ref<Record<string, string>>({})

// Filtrar produtos por nome ou categoria
const filteredProducts = computed(() => {
    if (!search.value) return produtos.value
    return produtos.value.filter(
        (p) =>
            p.nome.toLowerCase().includes(search.value.toLowerCase()) ||
            p.categoria.toLowerCase().includes(search.value.toLowerCase())
    )
})

// Função para adicionar produto à lista de extras
const addProduto = (produto: Produto) => {
    const qtd = quantidades[produto.nome] && quantidades[produto.nome] > 0 ? quantidades[produto.nome] : 1
    const existente = produtosExtras.value.find((p) => p.nome === produto.nome)

    if (existente) {
        existente.qtd += qtd
        existente.total += produto.preco * qtd
    } else {
        produtosExtras.value.push({
            nome: produto.nome,
            qtd,
            total: produto.preco * qtd,
        })
    }

    // Resetar quantidade para 1
    quantidades[produto.nome] = 1
    snackbar.value = true
}

// Função para remover 1 unidade do produto
const removeProduto = (item: ItemConsulta) => {
    const produto = produtosExtras.value.find((p) => p.nome === item.nome)
    if (!produto) return

    if (produto.qtd > 1) {
        produto.qtd -= 1
        produto.total -= produto.total / (produto.qtd + 1) // recalcula o valor unitário e diminui
    } else {
        produtosExtras.value = produtosExtras.value.filter((p) => p.nome !== item.nome)
    }
}

// Soma todos os itens da consulta + extras
const totalGeral = computed(() => {
    const totalConsulta = produtosConsulta.value.reduce((acc, item) => acc + item.total, 0)
    const totalExtras = produtosExtras.value.reduce((acc, item) => acc + item.total, 0)
    return totalConsulta + totalExtras
})

onMounted(() => {
    textInputs.value['input-nome'] = 'Mingau'
    textInputs.value['input-responsavel'] = 'Natália Bernini'
})

</script>


<style lang="scss">
.card-resumo-consulta {
    max-width: 600px;
    border: 1px solid #FF6B35;
    border-radius: 10px;
}

.row-btn-produtos {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 600px;
}
</style>
