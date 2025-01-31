import React from 'react';
//  { useState, useEffect }
// import { Grid, Typography, Card, CardContent, Box, Divider, List, ListItem, ListItemText } from '@mui/material';
// import {
//   PieChartOutlined,
//   BarChartOutlined,
//   LineChartOutlined,
//   FileSearchOutlined,
//   CarOutlined,
//   SettingOutlined,
//   UserOutlined,
//   AreaChartOutlined,
//   GlobalOutlined,
//   PictureOutlined
// } from '@ant-design/icons';

// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   ResponsiveContainer,
//   LineChart as RechartsLineChart,
//   Line
// } from 'recharts';

// import { notification } from 'components/notification';
// import { api } from 'services/api';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9747FF'];

// const Dashboard = () => {
//   // ==================================================
//   // 1) States
//   // ==================================================
//   const [atendimentosStatus, setAtendimentosStatus] = useState([]);
//   const [tempoMedioAtendimento, setTempoMedioAtendimento] = useState(0);
//   const [quilometragem, setQuilometragem] = useState({
//     quilometragem: [],
//     topMaioresDistancias: []
//   });
//   const [statusVistorias, setStatusVistorias] = useState({
//     statusAgrupado: [],
//     tempoMedioHorasConclusao: 0
//   });
//   const [checklists, setChecklists] = useState({
//     totalItensChecklistCadastrados: 0,
//     totalChecklistVistorias: 0,
//     concluidos: 0,
//     pendentes: 0,
//     impossibilitados: 0
//   });
//   const [atribuicaoTecnicos, setAtribuicaoTecnicos] = useState({
//     atribuicoesPorTecnico: [],
//     tempoMedioConclusaoPorTecnico: []
//   });
//   const [usuariosInfo, setUsuariosInfo] = useState({
//     totalUsuarios: 0,
//     ativos: 0,
//     inativos: 0
//   });
//   const [historicoVeiculos, setHistoricoVeiculos] = useState({
//     totalHistoricos: 0,
//     agrupadoPorTipo: {},
//     veiculosMaisOcorrencias: []
//   });
//   const [ocorrenciasManutencoes, setOcorrenciasManutencoes] = useState({
//     freqPorTipo: {}
//   });
//   const [utilizacaoVeiculos, setUtilizacaoVeiculos] = useState([]);
//   const [tendenciaAtendimentos, setTendenciaAtendimentos] = useState([]);
//   const [tendenciaVistorias, setTendenciaVistorias] = useState([]);
//   const [distribuicaoGeografica, setDistribuicaoGeografica] = useState([]);
//   const [checklistsPorTipo, setChecklistsPorTipo] = useState([]);
//   const [imagensEvidencias, setImagensEvidencias] = useState({
//     totalVistorias: 0,
//     vistoriasComEvidencias: [],
//     vistoriasSemEvidencias: 0
//   });

//   // =================================
//   // 2) Chamadas de API (useEffect)
//   // =================================
//   const fetchAtendimentosPorStatus = async () => {
//     try {
//       const { data } = await api.get('/dashboard/atendimentos-por-status');
//       setAtendimentosStatus(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar atendimentos por status.', type: 'error' });
//     }
//   };

//   const fetchTempoMedioAtendimento = async () => {
//     try {
//       const { data } = await api.get('/dashboard/tempo-medio-atendimento');
//       setTempoMedioAtendimento(data.tempoMedioHoras || 0);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar tempo médio de atendimento.', type: 'error' });
//     }
//   };

//   const fetchQuilometragem = async () => {
//     try {
//       const { data } = await api.get('/dashboard/quilometragem');
//       setQuilometragem(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar quilometragem.', type: 'error' });
//     }
//   };

//   const fetchStatusVistorias = async () => {
//     try {
//       const { data } = await api.get('/dashboard/status-vistorias');
//       setStatusVistorias(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar status das vistorias.', type: 'error' });
//     }
//   };

//   const fetchChecklists = async () => {
//     try {
//       const { data } = await api.get('/dashboard/checklists');
//       setChecklists(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar checklists.', type: 'error' });
//     }
//   };

//   const fetchAtribuicaoTecnicos = async () => {
//     try {
//       const { data } = await api.get('/dashboard/atribuicao-tecnicos');
//       setAtribuicaoTecnicos(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar atribuição de técnicos.', type: 'error' });
//     }
//   };

//   const fetchUsuariosInfo = async () => {
//     try {
//       const { data } = await api.get('/dashboard/usuarios');
//       setUsuariosInfo(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar informações de usuários.', type: 'error' });
//     }
//   };

//   const fetchHistoricoVeiculos = async () => {
//     try {
//       const { data } = await api.get('/dashboard/historico-veiculos');
//       setHistoricoVeiculos(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar histórico de veículos.', type: 'error' });
//     }
//   };

//   const fetchOcorrenciasManutencoes = async () => {
//     try {
//       const { data } = await api.get('/dashboard/ocorrencias-manutencoes');
//       setOcorrenciasManutencoes(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar ocorrências e manutenções.', type: 'error' });
//     }
//   };

//   const fetchUtilizacaoVeiculos = async () => {
//     try {
//       const { data } = await api.get('/dashboard/utilizacao-veiculos');
//       setUtilizacaoVeiculos(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar utilização de veículos.', type: 'error' });
//     }
//   };

//   const fetchTendenciaAtendimentos = async () => {
//     try {
//       const { data } = await api.get('/dashboard/tendencia/atendimentos?ano=2024');
//       setTendenciaAtendimentos(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar tendência de atendimentos.', type: 'error' });
//     }
//   };

//   const fetchTendenciaVistorias = async () => {
//     try {
//       const { data } = await api.get('/dashboard/tendencia/vistorias?ano=2024');
//       setTendenciaVistorias(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar tendência de vistorias.', type: 'error' });
//     }
//   };

//   const fetchDistribuicaoGeografica = async () => {
//     try {
//       const { data } = await api.get('/dashboard/distribuicao-geografica');
//       setDistribuicaoGeografica(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar distribuição geográfica.', type: 'error' });
//     }
//   };

//   const fetchChecklistsPorTipo = async () => {
//     try {
//       const { data } = await api.get('/dashboard/checklists/por-tipo');
//       setChecklistsPorTipo(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar checklists por tipo.', type: 'error' });
//     }
//   };

//   const fetchImagensEvidencias = async () => {
//     try {
//       const { data } = await api.get('/dashboard/imagens-evidencias');
//       setImagensEvidencias(data);
//     } catch (error) {
//       notification({ message: 'Erro ao buscar imagens e evidências.', type: 'error' });
//     }
//   };

//   useEffect(() => {
//     fetchAtendimentosPorStatus();
//     fetchTempoMedioAtendimento();
//     fetchQuilometragem();
//     fetchStatusVistorias();
//     fetchChecklists();
//     fetchAtribuicaoTecnicos();
//     fetchUsuariosInfo();
//     fetchHistoricoVeiculos();
//     fetchOcorrenciasManutencoes();
//     fetchUtilizacaoVeiculos();
//     fetchTendenciaAtendimentos();
//     fetchTendenciaVistorias();
//     fetchDistribuicaoGeografica();
//     fetchChecklistsPorTipo();
//     fetchImagensEvidencias();
//   }, []);

//   // ===========================================
//   // 3) Preparando dados para os gráficos
//   // ===========================================
//   const pieDataAtendimentos = atendimentosStatus.map((item) => ({
//     name: item.status,
//     value: item.count
//   }));

//   const barDataStatusVistorias = (statusVistorias.statusAgrupado || []).map((item) => ({
//     name: item.status,
//     count: Number(item.count)
//   }));

//   const lineDataAtendimentos = (tendenciaAtendimentos || []).map((item) => ({
//     name: `Mês ${item.mes}`,
//     quantidade: item.quantidade
//   }));

//   const lineDataVistorias = (tendenciaVistorias || []).map((item) => ({
//     name: `Mês ${item.mes}`,
//     quantidade: item.quantidade
//   }));

//   const pieDataChecklistsPorTipo = checklistsPorTipo.map((item) => ({
//     name: item.tipo,
//     value: item.count
//   }));

//   const topDistancias = quilometragem.topMaioresDistancias || [];
//   const { totalUsuarios, ativos, inativos } = usuariosInfo;
//   const { totalItensChecklistCadastrados, totalChecklistVistorias, concluidos, pendentes, impossibilitados } = checklists;

//   return (
//     <Grid container spacing={2}>
//       {/* Título */}
//       <Grid item xs={12}>
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: 'bold',
//             color: '#2e7d32',
//             textAlign: 'center',
//             mb: 2
//           }}
//         >
//           Painel
//         </Typography>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 1: 3 ITENS => xs=12 sm=6 md=4 (3 col) */}
//       {/* ============================================= */}
//       {/* 1) Atendimentos por Status (PieChart) */}
//       <Grid item xs={12} sm={6} md={4}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center">
//               <PieChartOutlined style={{ fontSize: 32, marginRight: 8, color: '#FF8042' }} />
//               <Typography variant="h6">Atendimentos por Status</Typography>
//             </Box>
//             <Box height={250}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={pieDataAtendimentos} dataKey="value" nameKey="name" outerRadius={80} label>
//                     {pieDataAtendimentos.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 2) Tempo Médio de Atendimento (Número em destaque) */}
//       <Grid item xs={12} sm={6} md={4}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center">
//               <FileSearchOutlined style={{ fontSize: 32, marginRight: 8, color: '#0088FE' }} />
//               <Typography variant="h6">Tempo Médio Atendimento (h)</Typography>
//             </Box>
//             <Box mt={2}>
//               <Typography variant="h4" color="text.primary">
//                 {tempoMedioAtendimento.toFixed(2)}
//               </Typography>
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 3) Status Vistorias (BarChart) */}
//       <Grid item xs={12} sm={6} md={4}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <BarChartOutlined style={{ fontSize: 32, marginRight: 8, color: '#00C49F' }} />
//               <Typography variant="h6">Status Vistorias</Typography>
//             </Box>
//             <Box height={150}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={barDataStatusVistorias}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#00C49F" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </Box>
//             <Divider sx={{ my: 1 }} />
//             <Typography variant="body2">
//               Tempo Médio Conclusão: <strong>{statusVistorias.tempoMedioHorasConclusao.toFixed(2)}h</strong>
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 2: 3 ITENS => xs=12 sm=6 md=4 (3 col) */}
//       {/* ============================================= */}
//       {/* 4) Checklists Info */}
//       <Grid item xs={12} sm={6} md={4}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <SettingOutlined style={{ fontSize: 32, marginRight: 8, color: '#FFBB28' }} />
//               <Typography variant="h6">Checklists</Typography>
//             </Box>
//             <Typography variant="body2">Total Itens Cadastrados: {totalItensChecklistCadastrados}</Typography>
//             <Typography variant="body2">Total ChecklistVistorias: {totalChecklistVistorias}</Typography>
//             <Typography variant="body2">Concluídos: {concluidos}</Typography>
//             <Typography variant="body2">Pendentes: {pendentes}</Typography>
//             <Typography variant="body2">Impossibilitados: {impossibilitados}</Typography>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 5) Atribuição Técnicos */}
//       <Grid item xs={12} sm={6} md={4}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <UserOutlined style={{ fontSize: 32, marginRight: 8, color: '#9747FF' }} />
//               <Typography variant="h6">Atribuição de Técnicos</Typography>
//             </Box>
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Vistorias por Técnico:
//             </Typography>
//             <List dense>
//               {atribuicaoTecnicos.atribuicoesPorTecnico.map((tec, idx) => (
//                 <ListItem key={idx}>
//                   <ListItemText primary={`Técnico ID: ${tec.tecnico}`} secondary={`Quantidade: ${tec.count}`} />
//                 </ListItem>
//               ))}
//             </List>
//             <Divider sx={{ my: 1 }} />
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Tempo Médio Conclusão por Técnico:
//             </Typography>
//             <List dense>
//               {atribuicaoTecnicos.tempoMedioConclusaoPorTecnico.map((tec, idx) => (
//                 <ListItem key={idx}>
//                   <ListItemText primary={`Técnico ID: ${tec.tecnico}`} secondary={`Horas: ${tec.horas.toFixed(2)}`} />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 6) Usuários Info */}
//       <Grid item xs={12} sm={6} md={4}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <UserOutlined style={{ fontSize: 32, marginRight: 8, color: '#2e7d32' }} />
//               <Typography variant="h6">Usuários</Typography>
//             </Box>
//             <Typography variant="body2">
//               Total: <strong>{totalUsuarios}</strong>
//             </Typography>
//             <Typography variant="body2">
//               Ativos: <strong>{ativos}</strong>
//             </Typography>
//             <Typography variant="body2">
//               Inativos: <strong>{inativos}</strong>
//             </Typography>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 3: 2 ITENS => xs=12 sm=12 md=6 (2 col) */}
//       {/* ============================================= */}
//       {/* 7) Histórico Veículos */}
//       <Grid item xs={12} sm={12} md={6}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <CarOutlined style={{ fontSize: 32, marginRight: 8, color: '#FF8042' }} />
//               <Typography variant="h6">Histórico de Veículos</Typography>
//             </Box>
//             <Typography variant="body2">Total de Históricos: {historicoVeiculos.totalHistoricos}</Typography>
//             <Divider sx={{ my: 1 }} />
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Agrupado por Tipo:
//             </Typography>
//             <List dense>
//               {Object.entries(historicoVeiculos.agrupadoPorTipo).map(([tipo, qt], idx) => (
//                 <ListItem key={idx}>
//                   <ListItemText primary={`${tipo}: ${qt}`} />
//                 </ListItem>
//               ))}
//             </List>
//             <Divider sx={{ my: 1 }} />
//             <Typography variant="subtitle2" sx={{ mb: 1 }}>
//               Veículos com mais ocorrências:
//             </Typography>
//             <List dense>
//               {historicoVeiculos.veiculosMaisOcorrencias.map((v, idx) => (
//                 <ListItem key={idx}>
//                   <ListItemText primary={`Veículo ID: ${v.veiculoId}`} secondary={`Ocorrências: ${v.ocorrencias}`} />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 8) Ocorrências Manutenções */}
//       <Grid item xs={12} sm={12} md={6}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <SettingOutlined style={{ fontSize: 32, marginRight: 8, color: '#6A5ACD' }} />
//               <Typography variant="h6">Ocorrências e Manutenções</Typography>
//             </Box>
//             <List dense>
//               {Object.entries(ocorrenciasManutencoes.freqPorTipo).map(([tipo, freq], idx) => (
//                 <ListItem key={idx}>
//                   <ListItemText primary={`${tipo}: ${freq}`} />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 4: 1 ITEM => xs=12 (1 col) */}
//       {/* ============================================= */}
//       {/* 9) Utilização Veículos */}
//       <Grid item xs={12}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={2}>
//               <CarOutlined style={{ fontSize: 36, marginRight: 8, color: '#FF8042' }} />
//               <Typography variant="h6">Utilização de Veículos</Typography>
//             </Box>
//             {utilizacaoVeiculos.map((item, index) => (
//               <Typography key={index} variant="body2" sx={{ marginBottom: 1 }}>
//                 Veículo ID: {item.veiculoId} - Placa: {item.placa} | KM Total: {item.totalKm} | Atendimentos: {item.qtdAtendimentos}
//               </Typography>
//             ))}
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 5: 2 ITENS => xs=12 sm=12 md=6 (2 col) */}
//       {/* ============================================= */}
//       {/* 10) Tendência Atendimentos (LineChart) */}
//       <Grid item xs={12} sm={12} md={6}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <AreaChartOutlined style={{ fontSize: 32, marginRight: 8, color: '#FFBB28' }} />
//               <Typography variant="h6">Tendência de Atendimentos (2024)</Typography>
//             </Box>
//             <Box height={250}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <RechartsLineChart data={lineDataAtendimentos}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="quantidade" stroke="#FFBB28" strokeWidth={3} />
//                 </RechartsLineChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 11) Tendência Vistorias (LineChart) */}
//       <Grid item xs={12} sm={12} md={6}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <LineChartOutlined style={{ fontSize: 32, marginRight: 8, color: '#9747FF' }} />
//               <Typography variant="h6">Tendência de Vistorias (2024)</Typography>
//             </Box>
//             <Box height={250}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <RechartsLineChart data={lineDataVistorias}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Line type="monotone" dataKey="quantidade" stroke="#9747FF" strokeWidth={3} />
//                 </RechartsLineChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 6: 2 ITENS => xs=12 sm=12 md=6 (2 col) */}
//       {/* ============================================= */}
//       {/* 12) Distribuição Geográfica */}
//       <Grid item xs={12} sm={12} md={6}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <GlobalOutlined style={{ fontSize: 32, marginRight: 8, color: '#32CD32' }} />
//               <Typography variant="h6">Distribuição Geográfica Vistorias</Typography>
//             </Box>
//             <List dense>
//               {distribuicaoGeografica.map((item, index) => (
//                 <ListItem key={index}>
//                   <ListItemText
//                     primary={`Vistoria ID: ${item.id}`}
//                     secondary={`CTO: ${item.cto} | EndereçoCliente: ${item.enderecoCliente}`}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* 13) Checklists por Tipo (PieChart) */}
//       <Grid item xs={12} sm={12} md={6}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <SettingOutlined style={{ fontSize: 32, marginRight: 8, color: '#DC143C' }} />
//               <Typography variant="h6">Checklists por Tipo</Typography>
//             </Box>
//             <Box height={250}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie data={pieDataChecklistsPorTipo} dataKey="value" nameKey="name" outerRadius={80} label>
//                     {pieDataChecklistsPorTipo.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </ResponsiveContainer>
//             </Box>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 7: 1 ITEM => xs=12 (1 col) */}
//       {/* ============================================= */}
//       {/* 14) Imagens e Evidências */}
//       <Grid item xs={12}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <PictureOutlined style={{ fontSize: 32, marginRight: 8, color: '#FF69B4' }} />
//               <Typography variant="h6">Imagens e Evidências</Typography>
//             </Box>
//             <Typography variant="body2">Total de Vistorias: {imagensEvidencias.totalVistorias}</Typography>
//             <Typography variant="body2" sx={{ mb: 1 }}>
//               Vistorias sem Evidências: {imagensEvidencias.vistoriasSemEvidencias}
//             </Typography>
//             <Divider sx={{ my: 1 }} />
//             <Typography variant="subtitle2">Vistorias e quantidade de imagens:</Typography>
//             <List dense>
//               {imagensEvidencias.vistoriasComEvidencias.map((vis, idx) => (
//                 <ListItem key={idx}>
//                   <ListItemText primary={`Vistoria ID: ${vis.vistoriaId}`} secondary={`Qtd. Imagens: ${vis.qtdImagens}`} />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>

//       {/* ============================================= */}
//       {/* LINHA 8: 1 ITEM => xs=12 (1 col) */}
//       {/* ============================================= */}
//       {/* 15) Quilometragem (Top Maiores Distâncias) */}
//       <Grid item xs={12}>
//         <Card>
//           <CardContent>
//             <Box display="flex" alignItems="center" mb={1}>
//               <CarOutlined style={{ fontSize: 32, marginRight: 8, color: '#FF7F50' }} />
//               <Typography variant="h6">Top Distâncias (Atendimentos)</Typography>
//             </Box>
//             <List dense>
//               {topDistancias.map((td, index) => (
//                 <ListItem key={index}>
//                   <ListItemText primary={`Atendimento ID: ${td.id}`} secondary={`KM Percorrida: ${td.kmPercorrida}`} />
//                 </ListItem>
//               ))}
//             </List>
//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

const Dashboard = () => {
  return <></>;
};

export default Dashboard;
