import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid as MuiGrid,
  Typography
} from '@mui/material';
import { EditOutlined, DeleteOutlined, RightOutlined } from '@ant-design/icons';
import { styled } from '@mui/material/styles';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary, { accordionSummaryClasses } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

import MainCard from 'components/sistema/MainCard';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

import CreateRole from './components/CreateRole';
import EditRole from './components/EditRole';
import CreatePermission from './components/CreatePermission';
import EditPermission from './components/EditPermission';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<RightOutlined style={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: 'rotate(90deg)'
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

const AdminRolesPermissions = () => {
  const [rolesData, setRolesData] = useState({
    items: [],
    search: '',
    page: 0,
    rowsPerPage: 5
  });
  const [roleModals, setRoleModals] = useState({
    createOpen: false,
    editOpen: false,
    selected: null
  });

  const [permissionsData, setPermissionsData] = useState({
    items: [],
    search: '',
    page: 0,
    rowsPerPage: 5
  });
  const [permissionModals, setPermissionModals] = useState({
    createOpen: false,
    editOpen: false,
    selected: null
  });

  const [assignData, setAssignData] = useState({
    selectedRole: null,
    assignedPermissions: [],
    initialAssignedPermissions: []
  });

  const [groupedPermissions, setGroupedPermissions] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRolesData((prev) => ({ ...prev, items: res.data }));
    } catch (error) {
      notification({ message: 'Erro ao buscar roles!', type: 'error' });
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await api.get('/permissions');
      setPermissionsData((prev) => ({ ...prev, items: res.data }));
    } catch (error) {
      notification({ message: 'Erro ao buscar permissões!', type: 'error' });
    }
  };

  const fetchRoleDetails = async (roleId) => {
    try {
      const res = await api.get(`/roles/${roleId}`);
      const permIds = res.data.permissions.map((p) => p.id);
      setAssignData((prev) => ({
        ...prev,
        assignedPermissions: permIds,
        initialAssignedPermissions: permIds
      }));
    } catch (error) {
      notification({ message: 'Erro ao buscar detalhes do role!', type: 'error' });
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    const groups = {};
    permissionsData.items.forEach((perm) => {
      if (!groups[perm.group]) groups[perm.group] = [];
      groups[perm.group].push(perm);
    });
    setGroupedPermissions(groups);
  }, [permissionsData.items]);

  const filteredRoles = rolesData.items.filter((role) => role.name.toLowerCase().includes(rolesData.search.toLowerCase()));
  const filteredPermissions = permissionsData.items.filter((perm) =>
    perm.name.toLowerCase().includes(permissionsData.search.toLowerCase())
  );

  const handleRolesPageChange = (event, newPage) => setRolesData((prev) => ({ ...prev, page: newPage }));
  const handleRolesRowsPerPageChange = (event) =>
    setRolesData((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));
  const handlePermissionsPageChange = (event, newPage) => setPermissionsData((prev) => ({ ...prev, page: newPage }));
  const handlePermissionsRowsPerPageChange = (event) =>
    setPermissionsData((prev) => ({
      ...prev,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0
    }));

  const handleSelectRoleForAssign = (roleId) => {
    const role = rolesData.items.find((r) => r.id === roleId);
    setAssignData((prev) => ({ ...prev, selectedRole: role }));
    if (role) {
      fetchRoleDetails(role.id);
    } else {
      setAssignData((prev) => ({
        ...prev,
        assignedPermissions: [],
        initialAssignedPermissions: []
      }));
    }
  };

  const handleTogglePermission = (permId) => {
    setAssignData((prev) => {
      const exists = prev.assignedPermissions.includes(permId);
      return {
        ...prev,
        assignedPermissions: exists ? prev.assignedPermissions.filter((id) => id !== permId) : [...prev.assignedPermissions, permId]
      };
    });
  };

  const handleToggleGroup = (group) => {
    const groupPermissionIds = groupedPermissions[group].map((p) => p.id);
    const allChecked = groupPermissionIds.every((id) => assignData.assignedPermissions.includes(id));
    setAssignData((prev) => {
      let newAssigned;
      if (allChecked) {
        newAssigned = prev.assignedPermissions.filter((id) => !groupPermissionIds.includes(id));
      } else {
        newAssigned = Array.from(new Set([...prev.assignedPermissions, ...groupPermissionIds]));
      }
      return { ...prev, assignedPermissions: newAssigned };
    });
  };

  const handleAccordionChange = (group) => (event, isExpanded) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: isExpanded }));
  };

  const handleSaveAssignedPermissions = async () => {
    if (!assignData.selectedRole) {
      notification({
        message: 'Selecione um role para atribuir permissões!',
        type: 'error'
      });
      return;
    }
    const { selectedRole, assignedPermissions, initialAssignedPermissions } = assignData;

    const newPermissions = assignedPermissions.filter((id) => !initialAssignedPermissions.includes(id));
    const removedPermissions = initialAssignedPermissions.filter((id) => !assignedPermissions.includes(id));

    try {
      if (newPermissions.length > 0) {
        await api.post(`/role-permissions/assign`, {
          roleId: selectedRole.id,
          permissionsIds: newPermissions
        });
      }

      if (removedPermissions.length > 0) {
        await api.post(`/role-permissions/bulk`, {
          roleId: selectedRole.id,
          ids: removedPermissions
        });
      }

      notification({
        message: 'Permissões atualizadas com sucesso!',
        type: 'success'
      });
      fetchRoleDetails(selectedRole.id);
      fetchRoles();
    } catch (error) {
      notification({
        message: 'Erro ao atualizar permissões do role!',
        type: 'error'
      });
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Título principal */}
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Administração de Roles, Permissões e Atribuição de Permissões
        </Typography>
      </Box>

      {/* Seção de Roles */}
      <MainCard title="Roles" sx={{ marginBottom: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
          <TextField
            label="Pesquisar Role"
            variant="outlined"
            size="small"
            value={rolesData.search}
            onChange={(e) => setRolesData((prev) => ({ ...prev, search: e.target.value }))}
            sx={{ width: '300px' }}
          />
          <Button variant="contained" onClick={() => setRoleModals((prev) => ({ ...prev, createOpen: true }))}>
            Novo
          </Button>
        </Box>
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: '0.4em' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: '4px' }
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoles
                  .slice(rolesData.page * rolesData.rowsPerPage, rolesData.page * rolesData.rowsPerPage + rolesData.rowsPerPage)
                  .map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            setRoleModals((prev) => ({
                              ...prev,
                              selected: role,
                              editOpen: true
                            }))
                          }
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={async () => {
                            if (window.confirm('Deseja realmente deletar este role?')) {
                              await api.delete(`/roles/${role.id}`);
                              notification({ message: 'Role deletado!', type: 'success' });
                              fetchRoles();
                            }
                          }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          component="div"
          count={filteredRoles.length}
          page={rolesData.page}
          onPageChange={handleRolesPageChange}
          rowsPerPage={rolesData.rowsPerPage}
          onRowsPerPageChange={handleRolesRowsPerPageChange}
          labelRowsPerPage="Linhas por página"
        />
      </MainCard>

      {/* Seção de Permissões */}
      <MainCard title="Permissões" sx={{ marginBottom: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
          <TextField
            label="Pesquisar Permissão"
            variant="outlined"
            size="small"
            value={permissionsData.search}
            onChange={(e) =>
              setPermissionsData((prev) => ({
                ...prev,
                search: e.target.value
              }))
            }
            sx={{ width: '300px' }}
          />
          <Button variant="contained" onClick={() => setPermissionModals((prev) => ({ ...prev, createOpen: true }))}>
            Nova
          </Button>
        </Box>
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: '0.4em' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: '4px' }
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Grupo</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPermissions
                  .slice(
                    permissionsData.page * permissionsData.rowsPerPage,
                    permissionsData.page * permissionsData.rowsPerPage + permissionsData.rowsPerPage
                  )
                  .map((perm) => (
                    <TableRow key={perm.id}>
                      <TableCell>{perm.name}</TableCell>
                      <TableCell>{perm.group}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() =>
                            setPermissionModals((prev) => ({
                              ...prev,
                              selected: perm,
                              editOpen: true
                            }))
                          }
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={async () => {
                            if (window.confirm('Deseja realmente deletar esta permissão?')) {
                              await api.delete(`/permissions/${perm.id}`);
                              notification({ message: 'Permissão deletada!', type: 'success' });
                              fetchPermissions();
                            }
                          }}
                        >
                          <DeleteOutlined fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          component="div"
          count={filteredPermissions.length}
          page={permissionsData.page}
          onPageChange={handlePermissionsPageChange}
          rowsPerPage={permissionsData.rowsPerPage}
          onRowsPerPageChange={handlePermissionsRowsPerPageChange}
          labelRowsPerPage="Linhas por página"
        />
      </MainCard>

      {/* Seção de Atribuição de Permissões */}
      <MainCard title="Atribuir Permissões ao Role">
        <FormControl fullWidth sx={{ marginBottom: '10px' }}>
          <InputLabel id="assign-role-label">Selecione um Role</InputLabel>
          <Select
            labelId="assign-role-label"
            value={assignData.selectedRole ? assignData.selectedRole.id : ''}
            label="Selecione um Role"
            onChange={(e) => handleSelectRoleForAssign(e.target.value)}
          >
            {rolesData.items.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {assignData.selectedRole && (
          <Box>
            <Box sx={{ paddingBottom: '10px' }}>
              <Typography variant="subtitle1">Permissões Disponíveis</Typography>
            </Box>
            {Object.keys(groupedPermissions).map((group, index, array) => {
              const groupPermissionIds = groupedPermissions[group].map((p) => p.id);
              const allChecked = groupPermissionIds.every((id) => assignData.assignedPermissions.includes(id));
              const someChecked = groupPermissionIds.some((id) => assignData.assignedPermissions.includes(id));
              const isFirst = index === 0;
              const isLast = index === array.length - 1;
              return (
                <Accordion
                  key={group}
                  expanded={expandedGroups[group] || false}
                  onChange={handleAccordionChange(group)}
                  style={{
                    borderTopLeftRadius: isFirst ? '8px' : 0,
                    borderTopRightRadius: isFirst ? '8px' : 0,
                    borderBottomLeftRadius: isLast ? '8px' : 0,
                    borderBottomRightRadius: isLast ? '8px' : 0,
                    border: '1px solid #E2E2E2FF'
                  }}
                >
                  <AccordionSummary
                    aria-controls={`${group}-content`}
                    id={`${group}-header`}
                    style={{
                      backgroundColor: '#FFFFFFFF',
                      borderTopLeftRadius: isFirst ? '8px' : 0,
                      borderTopRightRadius: isFirst ? '8px' : 0,
                      borderBottomLeftRadius: isLast ? '8px' : 0,
                      borderBottomRightRadius: isLast ? '8px' : 0
                    }}
                  >
                    <Box display="flex" alignItems="center" style={{ height: 10 }}>
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked && !allChecked}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleGroup(group);
                        }}
                        onFocus={(e) => e.stopPropagation()}
                      />
                      <Typography
                        component="span"
                        variant="subtitle1"
                        sx={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '15px' }}
                      >
                        {group}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup>
                      <MuiGrid container spacing={1}>
                        {groupedPermissions[group].map((perm) => (
                          <MuiGrid item xs={12} sm={6} md={4} key={perm.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={assignData.assignedPermissions.includes(perm.id)}
                                  onChange={() => handleTogglePermission(perm.id)}
                                />
                              }
                              label={perm.name}
                            />
                          </MuiGrid>
                        ))}
                      </MuiGrid>
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              );
            })}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSaveAssignedPermissions}>
                Salvar Permissões
              </Button>
            </Box>
          </Box>
        )}
      </MainCard>

      {/* Modais para Roles */}
      <CreateRole
        open={roleModals.createOpen}
        onClose={() => setRoleModals((prev) => ({ ...prev, createOpen: false }))}
        onSuccess={fetchRoles}
      />
      <EditRole
        open={roleModals.editOpen}
        role={roleModals.selected}
        onClose={() => setRoleModals((prev) => ({ ...prev, editOpen: false, selected: null }))}
        onSuccess={fetchRoles}
      />

      {/* Modais para Permissões */}
      <CreatePermission
        open={permissionModals.createOpen}
        onClose={() => setPermissionModals((prev) => ({ ...prev, createOpen: false }))}
        onSuccess={fetchPermissions}
      />
      <EditPermission
        open={permissionModals.editOpen}
        permission={permissionModals.selected}
        onClose={() => setPermissionModals((prev) => ({ ...prev, editOpen: false, selected: null }))}
        onSuccess={fetchPermissions}
      />
    </Box>
  );
};

export default AdminRolesPermissions;
