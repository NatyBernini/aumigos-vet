<template>
    <div>
        <!-- Modal de documento -->
        <v-dialog v-model="dialog" max-width="900px">
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span class="text-h6">Adicionar Documento</span>
                    <v-btn icon="mdi-close" @click="dialog = false"></v-btn>
                </v-card-title>

                <v-divider />

                <v-card-text class="scrollable-content">
                    <v-text-field v-model="form.nome" label="Nome *" variant="outlined" density="compact" clearable
                        required />

                    <v-select v-model="form.modeloCabecalho" :items="modelosCabecalho" label="Modelo de Cabeçalho"
                        variant="outlined" density="compact" />

                    <v-select v-model="form.modeloAnimal" :items="modelosAnimal" label="Informações do Animal"
                        variant="outlined" density="compact" />

                    <v-textarea v-model="form.conteudo" label="Conteúdo do Documento *" rows="6" auto-grow
                        variant="outlined" density="compact" />

                    <div class="mt-4">
                        <p class="text-subtitle-2 mb-2">Etiquetas disponíveis:</p>
                        <div class="d-flex flex-wrap ga-2">
                            <v-chip v-for="tag in etiquetas" :key="tag" color="primary" variant="outlined"
                                @click="inserirEtiqueta(tag)">
                                {{ tag }}
                            </v-chip>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="d-flex justify-end">
                    <v-btn color="grey" variant="text" @click="dialog = false">Cancelar</v-btn>
                    <v-btn color="primary" variant="flat" @click="salvar">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Botão para abrir modal -->
        <v-btn color="primary" @click="dialog = true">Novo Documento</v-btn>

        <!-- Lista de documentos salvos -->
        <div class="mt-6">
            <h3>Documentos Salvos</h3>
            <v-list>
                <v-list-item v-for="(doc, index) in documentos" :key="index">
                    <v-list-item-content>
                        <v-list-item-title>{{ doc.nome }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-btn color="secondary" @click="verDocumento(doc)">Ver Documento</v-btn>
                    </v-list-item-action>
                </v-list-item>
            </v-list>
        </div>

        <!-- Modal de visualização PDF -->
        <v-dialog v-model="pdfDialog" max-width="1000px">
            <v-card>
                <v-card-title class="d-flex justify-space-between align-center">
                    <span class="text-h6">Visualizar Documento</span>
                    <v-btn icon="mdi-close" @click="pdfDialog = false"></v-btn>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-0">
                    <iframe v-if="pdfUrl" :src="pdfUrl" style="width: 100%; height: 80vh; border: none;"></iframe>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import jsPDF from "jspdf";
import logo from "@/assets/LogoAumigo.png";

interface Documento {
    nome: string;
    modeloCabecalho: number | null;
    modeloAnimal: number | null;
    conteudo: string;
}

const dialog = ref(false);
const pdfDialog = ref(false);
const pdfUrl = ref<string | null>(null);

const form = ref<Documento>({
    nome: "",
    modeloCabecalho: null,
    modeloAnimal: null,
    conteudo: "",
});

const documentos = ref<Documento[]>([
    {
        nome: "Documento de Teste",
        modeloCabecalho: 1,
        modeloAnimal: 1,
        conteudo: "Este é um conteúdo de teste do documento. Aqui você pode colocar informações sobre o animal ou observações gerais."
    },

       {
        nome: "Receituário",
        modeloCabecalho: 1,
        modeloAnimal: 1,
        conteudo: "Este é um conteúdo de teste do documento. AquiNão gosta de humanos Não gosta de ficar em casa, apenas em seu habitat natural Mesmo tendo ração ainda no pote faz drama Conclusão: Não há o que fazer, pois já vive dessa forma há 10 anos, então o melhor a se fazer Não gosta de humanos Não gosta de ficar em casa, apenas em seu habitat natural Mesmo tendo ração ainda no pote faz drama Conclusão: Não há o que fazer, pois já vive dessa forma há 10 anos, então o melhor a se fazer é dar muito amor e carinho para ver se um dia amolece o coração delaNão gosta de humanos Não gosta de ficar em casa, apenas em seu habitat natural Mesmo tendo ração ainda no pote faz drama Conclusão: Não há o que fazer, pois já vive dessa forma há 10 anos, então o melhor a se fazer é dar muito amor e carinho para ver se um dia amolece o coração delaé dar muito amor e carinho para ver se um dia amolece o coração dela você pode colocar informações sobre o animal ou observações gerais."
    }
]);


const modelosCabecalho = [
    { title: "Modelo 1 - Logo e endereço", value: 1 },
    { title: "Modelo 2 - Logo e dados completos", value: 2 },
    { title: "Modelo 3 - Minimalista", value: 3 },
    { title: "Nenhum", value: 4 },
];

const modelosAnimal = [
    { title: "Modelo 1 - Básico", value: 1 },
    { title: "Modelo 2 - Completo", value: 2 },
    { title: "Nenhum", value: 3 },
];

const etiquetas = ["{nome}", "{cpf}", "{data_nasc}", "{responsavel}", "{peso}", "{especie}"];

function inserirEtiqueta(tag: string) {
    form.value.conteudo += " " + tag;
}

function salvar() {
    if (!form.value.nome || !form.value.conteudo) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    documentos.value.push({ ...form.value });

    form.value = { nome: "", modeloCabecalho: null, modeloAnimal: null, conteudo: "" };
    dialog.value = false;
}


async function verDocumento(doc: Documento) {
    const pdf = new jsPDF("p", "mm", "a4"); // formato A4
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const margin = 10;
    const lineHeight = 7;

    // ===== Pré-carrega a imagem do logo =====
    const imgLogo = new Image();
    imgLogo.src = logo;
    await new Promise<void>((resolve) => {
        imgLogo.onload = () => resolve();
    });

    // ===== Função para desenhar cabeçalho e título =====
    const desenharCabecalho = () => {
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.1);

        const headerX = 10;
        const headerY = 10;
        const headerWidth = pageWidth - 20;
        const headerHeight = 25;

        // Retângulo do cabeçalho
        pdf.roundedRect(headerX, headerY, headerWidth, headerHeight, 1, 1, "S");

        // Centro vertical do cabeçalho
        const centerY = headerY + headerHeight / 2;

        // =======================
        // Logo
        // =======================
        const maxWidthLogo = 25;
        const maxHeightLogo = 25;

        const ratio = imgLogo.width / imgLogo.height;
        let imgWidth = maxWidthLogo;
        let imgHeight = maxHeightLogo;

        if (ratio > 1) {
            imgHeight = maxWidthLogo / ratio;
        } else {
            imgWidth = maxHeightLogo * ratio;
        }

        // Ajusta Y para centralizar verticalmente
        const imgY = centerY - imgHeight / 2;
        pdf.addImage(imgLogo, "PNG", headerX + 5, imgY, imgWidth, imgHeight);

        // =======================
        // Textos à direita
        // =======================
        const textRightX = pageWidth - 15;
        pdf.setFontSize(10);

        const texts = [
            "Clínica Veterinária Aumigos",
            "Endereço: Rua Exemplo, 123, Barbacena, MG",
            "Telefone: (11) 99999-9999"
        ];

        const lineHeightTxt = 4.5;
        const totalTextHeight = texts.length * lineHeightTxt;

        let textY = centerY - totalTextHeight / 2 + lineHeightTxt;

        texts.forEach(line => {
            pdf.text(line, textRightX, textY, { align: "right" });
            textY += lineHeightTxt;
        });

        // =======================
        // Retângulo do título
        // =======================
        pdf.roundedRect(10, 40, pageWidth - 20, 10, 1, 1, "S");
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(doc.nome.toUpperCase(), pageWidth / 2, 47, { align: "center" });

        // 🔹 Resetar para normal logo após o cabeçalho
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
    };

    const desenharAnimal = (startY = 60) => {
        const fontSize = 10;
        pdf.setFontSize(fontSize);

        const lineHeightAnimal = 5.5;
        const padding = 8;

        const col1X = margin + 5;
        const col1ValorX = margin + 30;
        const col2X = pageWidth / 2 + 5;
        const col2ValorX = pageWidth / 2 + 18;

        const col1 = [
            { titulo: "Nome", valor: "Teddy Junior" },
            { titulo: "Espécie", valor: "Felina" },
            { titulo: "Raça", valor: "SRD" },
            { titulo: "Pelagem", valor: "Preta" },
            { titulo: "Responsável", valor: "Natália Beatriz Malta Bernini" }
        ];

        const col2 = [
            { titulo: "Peso", valor: "4kg" },
            { titulo: "Sexo", valor: "Fêmea" },
            { titulo: "Idade", valor: "10 anos" },
            { titulo: "Chip", valor: "123456789" },
            { titulo: "CPF", valor: "111.222.333-44" }
        ];

        const endereco = { titulo: "Endereço", valor: "Rua Professor Osvaldo Navarro, n 22, Campo, Barbacena, CEP 36200-604" };

        const maxWidthCol1 = pageWidth / 2 - col1ValorX - padding;
        const maxWidthCol2 = pageWidth - col2ValorX - padding;
        const maxWidthEndereco = pageWidth - (margin * 2) - 30;

        const calcularAlturaColuna = (col: { valor: string }[], maxWidth: number) => {
            let altura = 0;
            col.forEach(item => {
                const linhas = pdf.splitTextToSize(item.valor, maxWidth);
                altura += linhas.length * lineHeightAnimal + 2;
            });
            return altura;
        };

        const alturaCol1 = calcularAlturaColuna(col1, maxWidthCol1);
        const alturaCol2 = calcularAlturaColuna(col2, maxWidthCol2);

        const linhasEndereco = pdf.splitTextToSize(endereco.valor, maxWidthEndereco);
        const alturaEndereco = linhasEndereco.length * lineHeightAnimal + 5;

        const alturaRetangulo = Math.max(alturaCol1, alturaCol2) + alturaEndereco - 5 + padding * 2;

        pdf.roundedRect(margin, startY, pageWidth - 2 * margin, alturaRetangulo, 2, 2, "S");

        let y1 = startY + padding;
        col1.forEach(item => {
            pdf.setFont("helvetica", "bold");
            pdf.text(`${item.titulo}:`, col1X, y1);
            pdf.setFont("helvetica", "normal");
            const linhas = pdf.splitTextToSize(item.valor, maxWidthCol1);
            linhas.forEach((linha: string) => {
                pdf.text(linha, col1ValorX, y1);
                y1 += lineHeightAnimal;
            });
            y1 += 2;
        });

        let y2 = startY + padding;
        col2.forEach(item => {
            pdf.setFont("helvetica", "bold");
            pdf.text(`${item.titulo}:`, col2X, y2);
            pdf.setFont("helvetica", "normal");
            const linhas = pdf.splitTextToSize(item.valor, maxWidthCol2);
            linhas.forEach((linha: string) => {
                pdf.text(linha, col2ValorX, y2);
                y2 += lineHeightAnimal;
            });
            y2 += 2;
        });

        const yEndereco = Math.max(y1, y2) + 5;
        pdf.setFont("helvetica", "bold");
        pdf.text(`${endereco.titulo}:`, margin + 5, yEndereco);
        pdf.setFont("helvetica", "normal");
        linhasEndereco.forEach((linha: string, i: number) => {
            pdf.text(linha, margin + 30, yEndereco + i * lineHeightAnimal);
        });

        return startY + alturaRetangulo + 5;
    };

    const desenharRodape = () => {
        const footerY = pageHeight - 40;
        pdf.line(20, footerY + 10, 80, footerY + 10);
        pdf.text("Assinatura", 50, footerY + 17, { align: "center" });
        pdf.line(90, footerY + 10, 150, footerY + 10);
        pdf.text("Carimbo", 120, footerY + 17, { align: "center" });
        const hoje = new Date().toLocaleDateString("pt-BR");
        pdf.line(160, footerY + 10, 200, footerY + 10);
        pdf.text(`Data: ${hoje}`, 180, footerY + 17, { align: "center" });
    };

    // ===== Primeira página =====
    desenharCabecalho();
    const inicioConteudo = desenharAnimal();

    // ===== Área de conteúdo =====
    pdf.setFont("helvetica", "normal"); // 🔹 garante que o corpo não fique em bold
    pdf.setFontSize(12);

    let y = inicioConteudo + 5;
    const maxWidth = pageWidth - margin * 2;
    const splitConteudo = pdf.splitTextToSize(doc.conteudo, maxWidth);

    splitConteudo.forEach((line: string) => {
        if (y > pageHeight - 60) {
            desenharRodape();
            pdf.addPage();
            desenharCabecalho();
            pdf.setFont("helvetica", "normal"); // 🔹 garante fonte normal também em novas páginas
            pdf.setFontSize(12);
            y = 60;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
    });

    desenharRodape();

    const pdfBlob = pdf.output("blob");
    pdfUrl.value = URL.createObjectURL(pdfBlob);
    pdfDialog.value = true;
}

</script>

<style scoped>
.scrollable-content {
    max-height: 60vh;
    overflow-y: auto;
}
</style>
