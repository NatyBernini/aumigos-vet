<template>
    <v-card>
        <p class="title-page">Cadastro de Serviços & Produtos
            <img src="/./src/assets/icons/iconLapisCadastro.png" alt="Ícone" class="menu-title-icon" />
        </p>

        <p class="sub-page">Serviços / <span class="aba-atual">Cadastrar</span>
            <img src="/./src/assets/icons/iconeCadastro.png" alt="Ícone" class="menu-sub-icon" />
        </p>

        <v-tabs v-model="tab">
            <v-tab value="one">Informações do Serviço/Produto</v-tab>
        </v-tabs>

        <v-card-text>
            <v-tabs-window v-model="tab">
                <v-tabs-window-item value="one" class="pt-10">

                    <form @submit.prevent="">

                        <inputText label="Nome*" type="text" required v-model:valueInput="textInputs[`input-nome`]"
                            id="input-nome" style="max-width: 350px;" />

                        <v-row class="row-padrao">
                            <multipleCombobox v-model="categoria" :items="listCategoria"
                                :extra-items="listExtraCategoria" label="Categoria*" variant="outlined" id="categoria"
                                :isRequired="false" :isMultipleSelect="false"
                                class="container-combobox-padrao mt-4 mb-4" placeholder="Selecione a categoria"
                                style="max-width: 350px;" />

                            <multipleCombobox v-model="unidade" :items="listUnidade" :extra-items="listExtraUnidade"
                                label="Unidade de medida*" variant="outlined" id="unidade" :isRequired="false"
                                :isMultipleSelect="false" class="container-combobox-padrao mt-4 mb-4"
                                placeholder="Selecione a unidade" style="max-width: 350px;"
                                :disabled="!categoria?.length" />

                        </v-row>


                        <inputText class="input-valor mt-2" label="Valor*" type="text" required :prefix="'R$'"
                            v-model:valueInput="textInputs[`input-valor`]" id="input-valor" :maxLength="0"
                            style="max-width: 50px!important;" @input="validateDecimalInput($event)" />

                        <v-switch v-model="status" :label="`Status: ${status}`" false-value="inativo" true-value="ativo"
                            hide-details></v-switch>

                        <textArea :modelValue="textarea" @update:modelValue="(value: any) => (textarea = value)"
                            :label="'Descrição'" class="wrap-textarea" :maxLength="300"
                            placeholder="Detalhe mais sobre o serviço ou produto...">
                        </textArea>
                        <!-- Botões -->
                        <div class="container-btn mt-5">
                            <p class="msg-auxiliar">Campos Obrigatórios*</p>
                        </div>

                        <div class="container-btn mt-5">
                            <v-btn class="btn-padrao">
                                Limpar Tudo
                            </v-btn>
                            <v-btn class="me-4 btn-padrao" type="submit">Salvar</v-btn>
                        </div>
                    </form>

                </v-tabs-window-item>
            </v-tabs-window>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>import { ref, watch } from 'vue'

// COMPONENTES
import inputText from '@/components/inputText.vue'
import multipleCombobox from '@/components/select.vue'
import textArea from '@/components/textArea.vue'

const tab = ref(null)
const textInputs = ref<Record<string, string>>({})
const status = ref('ativo')
const textarea = ref('')

// CATEGORIA
const categoria = ref<string | undefined>(undefined)
const listCategoria = ref<string[]>([
    'Serviço',
    'Medicamento',
    'Exame',
    'Procedimento',
    'Outra'
])
const listExtraCategoria = ref<Array<{ id: string; descricao: string }>>([
    { id: '1', descricao: 'Serviço' },
    { id: '2', descricao: 'Medicamento' },
    { id: '3', descricao: 'Exame' },
    { id: '4', descricao: 'Procedimento' },
    { id: '5', descricao: 'Outra' }
])

// UNIDADE
const unidade = ref<string | undefined>(undefined)
const listUnidade = ref<string[]>([]) // <- começa vazio
const listExtraUnidade = ref<Array<{ id: string; descricao: string }>>([])

// Mapeamento por categoria
const unidadesPorCategoria: Record<string, string[]> = {
    'Serviço': ['Unidade', 'Hora', 'Sessão', 'Diária', 'Pacote', 'Outra'],
    'Medicamento': [
        'Unidade',
        'Caixa',
        'Dose',
        'Ampola',
        'Frasco',
        'Bisnaga',
        'Cápsula',
        'Comprimido', 'Outra'
    ],
    'Exame': ['Unidade', 'Sessão', 'Outra'],
    'Procedimento': ['Unidade', 'Hora', 'Sessão', 'Diária', 'Outra'],
    'Outra': [
        'Unidade',
        'Pacote',
        'Kit',
        'Kg',
        'Grama',
        'Miligrama',
        'Litro',
        'Outra'
    ]
}

// Sempre que a categoria mudar, atualiza as unidades disponíveis
watch(categoria, (novaCategoria) => {
    if (novaCategoria && unidadesPorCategoria[novaCategoria]) {
        listUnidade.value = unidadesPorCategoria[novaCategoria]
        listExtraUnidade.value = listUnidade.value.map((u, idx) => ({
            id: String(idx + 1),
            descricao: u
        }))
        unidade.value = undefined // limpa seleção anterior
    } else {
        listUnidade.value = []
        listExtraUnidade.value = []
        unidade.value = undefined
    }
})

// FUNÇÃO DE FORMATAÇÃO DE VALOR 
const validateDecimalInput = (event: Event) => {
    const inputElement = event.target as HTMLInputElement

    // 1. Só dígitos
    let digits = inputElement.value.replace(/\D/g, '')

    // 2. Remove zeros à esquerda, garante pelo menos “0”
    digits = digits.replace(/^0+/, '')
    if (digits === '') digits = '0'

    // 3. Limita a 8 dígitos (6 + 2)
    if (digits.length > 8) digits = digits.slice(0, 8)

    // 4. Monta o valor com vírgula
    let formatted: string
    if (digits.length <= 2) {
        formatted = '0,' + digits.padStart(2, '0')
    } else {
        const before = digits.slice(0, -2).slice(-6)
        const after = digits.slice(-2)
        formatted = `${before},${after}`
    }

    // 5. Atualiza input / v-model só se mudou
    if (inputElement.value !== formatted) {
        inputElement.value = formatted
        inputElement.dispatchEvent(new Event('input', { bubbles: true }))

        const id = inputElement.id
        if (textInputs.value && id) textInputs.value[id] = formatted
    }
}


</script>
<style lang="scss"></style>