/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import MainCard from 'components/sistema/MainCard';
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Pagination,
  Collapse,
  IconButton,
  Typography
} from '@mui/material';
import { api } from 'services/api';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const levelColor = (level) => {
  switch (level) {
    case 'error':
      return 'error';
    case 'warn':
      return 'warning';
    case 'info':
      return 'primary';
    case 'debug':
      return 'default';
    default:
      return 'default';
  }
};

function Row({ row, type }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover>
        <TableCell sx={{ width: 48 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <UpOutlined /> : <DownOutlined />}
          </IconButton>
        </TableCell>
        <TableCell>{new Date(row.createdAt).toLocaleString()}</TableCell>
        <TableCell>
          <Chip size="small" color={levelColor(row.level)} label={row.level || '-'} />
        </TableCell>
        {type === 'api' ? (
          <>
            <TableCell>{row.method}</TableCell>
            <TableCell>{row.statusCode}</TableCell>
            <TableCell>{row.durationMs} ms</TableCell>
            <TableCell>{row.url}</TableCell>
          </>
        ) : (
          <>
            <TableCell>{row.action}</TableCell>
            <TableCell>{row.entity}</TableCell>
            <TableCell>{row.entityId}</TableCell>
            <TableCell>{row.source}</TableCell>
          </>
        )}
        <TableCell>{row.userUsername || row.userId}</TableCell>
        <TableCell>{row.ip}</TableCell>
        <TableCell sx={{ maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.message}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={12} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2, bgcolor: 'background.default' }}>
              {type === 'api' ? (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Controller/Handler</Typography>
                  <Typography variant="body2">
                    {row.controller} / {row.handler}
                  </Typography>
                  <Typography variant="subtitle2">Params</Typography>
                  <pre style={{ margin: 0 }}>{JSON.stringify(row.params, null, 2)}</pre>
                  <Typography variant="subtitle2">Query</Typography>
                  <pre style={{ margin: 0 }}>{JSON.stringify(row.query, null, 2)}</pre>
                  <Typography variant="subtitle2">Body</Typography>
                  <pre style={{ margin: 0 }}>{JSON.stringify(row.body, null, 2)}</pre>
                  {row.errorMessage && (
                    <>
                      <Typography variant="subtitle2">Erro</Typography>
                      <pre style={{ margin: 0 }}>
                        {row.errorName}: {row.errorMessage}
                      </pre>
                      {row.stack && <pre style={{ margin: 0 }}>{row.stack}</pre>}
                    </>
                  )}
                </Stack>
              ) : (
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Detalhes</Typography>
                  <pre style={{ margin: 0 }}>{JSON.stringify(row.context, null, 2)}</pre>
                </Stack>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function Logs() {
  const [type, setType] = useState('api');
  const [level, setLevel] = useState('');
  const [method, setMethod] = useState('');
  const [userId, setUserId] = useState('');
  const [requestId, setRequestId] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [action, setAction] = useState('');
  const [entity, setEntity] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ items: [], total: 0 });

  const params = useMemo(() => {
    const p = { type, page, pageSize };
    if (level) p.level = level;
    if (userId) p.userId = userId;
    if (requestId) p.requestId = requestId;
    if (message) p.message = message;
    if (dateFrom) p.dateFrom = dateFrom;
    if (dateTo) p.dateTo = dateTo;
    if (type === 'api') {
      if (method) p.method = method;
      if (url) p.url = url;
      if (error) p.error = error;
    } else {
      if (action) p.action = action;
      if (entity) p.entity = entity;
    }
    return p;
  }, [type, level, method, userId, requestId, url, error, message, action, entity, dateFrom, dateTo, page, pageSize]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/logs', { params });
      setData(res.data || { items: [], total: 0 });
    } catch (e) {
      setData({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <MainCard title="Logs do Sistema" subTitle="Acompanhe e filtre eventos do sistema">
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="api">API</MenuItem>
              <MenuItem value="audit">Auditoria</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Nível</InputLabel>
            <Select
              label="Nível"
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="error">error</MenuItem>
              <MenuItem value="warn">warn</MenuItem>
              <MenuItem value="info">info</MenuItem>
              <MenuItem value="debug">debug</MenuItem>
            </Select>
          </FormControl>
          <TextField label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <TextField label="Request ID" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
          <TextField label="Mensagem" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Stack>

        {type === 'api' ? (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <FormControl sx={{ minWidth: 140 }}>
              <InputLabel>Método</InputLabel>
              <Select label="Método" value={method} onChange={(e) => setMethod(e.target.value)}>
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="GET">GET</MenuItem>
                <MenuItem value="POST">POST</MenuItem>
                <MenuItem value="PUT">PUT</MenuItem>
                <MenuItem value="PATCH">PATCH</MenuItem>
                <MenuItem value="DELETE">DELETE</MenuItem>
              </Select>
            </FormControl>
            <TextField label="URL contém" value={url} onChange={(e) => setUrl(e.target.value)} sx={{ flex: 1 }} />
            <TextField label="Erro contém" value={error} onChange={(e) => setError(e.target.value)} sx={{ flex: 1 }} />
          </Stack>
        ) : (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField label="Ação" value={action} onChange={(e) => setAction(e.target.value)} />
            <TextField label="Entidade" value={entity} onChange={(e) => setEntity(e.target.value)} />
          </Stack>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label="Data início"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <TextField
            label="Data fim"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel>Itens por página</InputLabel>
            <Select
              label="Itens por página"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[10, 20, 50, 100].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={() => {
              setPage(1);
              fetchData();
            }}
            disabled={loading}
          >
            Aplicar
          </Button>
        </Stack>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Data</TableCell>
                <TableCell>Nível</TableCell>
                {type === 'api' ? (
                  <>
                    <TableCell>Método</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duração</TableCell>
                    <TableCell>URL</TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>Ação</TableCell>
                    <TableCell>Entidade</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>Fonte</TableCell>
                  </>
                )}
                <TableCell>User</TableCell>
                <TableCell>Ip</TableCell>
                <TableCell>Mensagem</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((row) => (
                <Row key={row.id} row={row} type={type} />
              ))}
              {!loading && data.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    Sem resultados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box />
          <Pagination
            count={Math.max(1, Math.ceil((data.total || 0) / pageSize))}
            page={page}
            onChange={(_, p) => setPage(p)}
            size="small"
          />
        </Stack>
      </Stack>
    </MainCard>
  );
}
