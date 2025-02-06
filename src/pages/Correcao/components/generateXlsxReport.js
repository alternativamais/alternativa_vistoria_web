import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { api } from 'services/api';

export const generateXlsxReport = async () => {
  try {
    const response = await api.get('/vistorias/relatorio');
    const { resumo, detalhado } = response.data;

    // Criar primeira aba (Resumo)
    const resumoSheetData = [
      ['Métrica', 'Valor'],
      ['Total de Vistorias', resumo.totalVistorias],
      ['Vistorias Abertas', resumo.abertas],
      ['Vistorias Concluídas', resumo.concluidas],
      ['Assinaturas Eletrônicas', resumo.assinaturaEletronica],
      ['Metragem Total de Cabo', resumo.metragemTotal]
    ];
    const resumoSheet = XLSX.utils.aoa_to_sheet(resumoSheetData);

    // Criar segunda aba (Detalhado)
    const detalhadoSheet = XLSX.utils.json_to_sheet(detalhado);

    // Criar workbook e adicionar abas
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, resumoSheet, 'Resumo');
    XLSX.utils.book_append_sheet(workbook, detalhadoSheet, 'Detalhado');

    // Gerar arquivo e salvar
    const xlsxBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([xlsxBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Relatorio_Vistorias.xlsx');
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
  }
};
