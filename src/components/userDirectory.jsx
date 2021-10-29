import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import {Box, TextField, Button, Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment }from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useMutation, useQueryClient } from 'react-query';
// import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2/src/sweetalert2';
import '@sweetalert2/theme-material-ui/material-ui.css';
import * as Yup from 'yup';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDate from '@mui/lab/AdapterDateFns';
import { useFormik, Form, FormikProvider } from 'formik';
// icons
import PersonIcon from '@mui/icons-material/Person';
import EventIcon from '@mui/icons-material/Event';
import WcIcon from '@mui/icons-material/Wc';
import EmailIcon from '@mui/icons-material/Email';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import ContactsIcon from '@mui/icons-material/Contacts';
import PasswordIcon from '@mui/icons-material/Password';
import AddIcon from '@mui/icons-material/Add';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { addUser, updateUser, deleteUsers } from '../api/mutations/Users';
import { convertUTCtoLocal } from '../utils/functions';
import { useUsers } from '../hooks/get-users';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: true,
    label: 'First Name',
  },
  {
    id: 'last_name',
    numeric: true,
    disablePadding: false,
    label: 'Last Name',
  },
  {
    id: 'gender',
    numeric: true,
    disablePadding: false,
    label: 'Gender',
  },
  {
    id: 'email',
    numeric: true,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'mobile',
    numeric: true,
    disablePadding: false,
    label: 'Contact',
  },
  {
    id: 'password',
    numeric: true,
    disablePadding: false,
    label: 'Password',
  },
  // {
  //   id: 'confirm_password',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Confirm Password',
  // },
  {
    id: 'dob',
    numeric: true,
    disablePadding: false,
    label: 'Date Of Birth',
  },
  {
    id: 'address',
    numeric: true,
    disablePadding: false,
    label: 'Address',
  },
  {
    id: 'action',
    label: '',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
      <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
        User Directory
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={props.handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, ] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [dobList, ] = React.useState({});

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  // For Testing 
  // React.useEffect(() => {
  //   console.log("Selected Rows : ", selected);
  // }, [selected])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (id) => selected.indexOf(id) !== -1;


  /* ========================== ADD User Form ====================================== */

  // const dispatch = useDispatch();

  const cache = useQueryClient();
  const [showPassword, setShowPassword] = useState(false); // toggle password show/hide

  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [submitClicked, setSubmitClicked] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState('');

  // Change to add Respective column
  const [
    editable, 
    // setEditable 
  ] = useState({
    firstname: false,
    lastname: false,
    gender: false,
    email: true,
    contact: true,
    address: true,
    dob: false
  }); // Change to true to make all field editable

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  // const handleShowConfirmPassword = () => {
  //   setShowConfirmPassword((show) => !show);
  // };

  const { mutate } = useMutation(addUser, {
    onMutate: () => {
      Swal.fire({
        icon: 'info',
        title: 'Hold on....',
        text: 'Registering New User😃',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
    }
  });

  const { mutate: updateUserMutation } = useMutation(updateUser, {
    onMutate: () => {
      Swal.fire({
        icon: 'info',
        title: 'Hold on....',
        text: 'Updating User 😃',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });
    }
  });

  /* ====================== Delete Selected  Users ========================  */

const { mutate: deleteUsersMutation } = useMutation(deleteUsers, {
  onMutate: () => {
    Swal.fire({
      icon: 'info',
      title: 'Hold on....',
      text: `${!selected?.length === 0 ? 'Deleting User' : 'Deleting Users'}`,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });
  }
});

const handleDeleteUsers = () => {
  if(selected.length > 0){
  deleteUsersMutation({ users: selected }, {
    onError: (error) => {
      // for unauthorized access
      if (error.response && error.response.status === 401) {
        // dispatch(logOut());
      }

      const msg = error.response
        ? error.response.data.message || error.toString()
        : error.toString();

      Swal.fire({
        icon: 'error',
        title: 'Something went wrong!',
        text: msg,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Users Deleted',
        text: data.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    },
    onSettled: () => {
      cache.invalidateQueries('users');
    }
  });
  }
  
}

  // using formik for form validation, and Yup to design validation Schema
  const formik = useFormik({
    initialValues: {
        firstname: '',
        lastname: '',
        gender: '',
        contact: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        address: '',
    },
    validationSchema: Yup.object({
      firstname: Yup.string()
        .required("First Name is required")
        .matches(
          /^[a-zA-Z][a-zA-Z\s]*$/,
          "Please enter a valid name (only alphabets & whitespaces are allowed)"
        ),
      lastname: Yup.string()
      .required("Last Name is required")
      .matches(
        /^[a-zA-Z][a-zA-Z\s]*$/,
        "Please enter a valid name (only alphabets & whitespaces are allowed)"
      ),
      email: Yup.string()
        .email("Invalid email address")
        .required("E-mail is required"),
      contact: Yup.string()
        .required("Contact number is required")
        .matches(/^[6-9]\d{9}$/, "Invalid mobile number"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Minimum 6 characters")
        .max(15, "Maximum 15 characters")
        .matches(
          /^[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,15}$/,
          "Password can only contain alphabets, numbers or special characters"
      ),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values, actions) => {
        console.log(values);
        actions.setStatus(null);
        const data = {
          firstname: values.firstname,
          lastname: values.lastname,
          gender: values.gender,
          email: values.email.toLowerCase(),
          contact: values.contact,
          password: values.password,
          dob: convertUTCtoLocal(values.dateOfBirth, true),
          address: values.address
        };
  
        // console.log('User Add Form :', data);
  
        mutate(data, {
          onError: (error) => {
            // for unauthorized access
            if (error.response && error.response.status === 401) {
              // dispatch(logOut());
            }
  
            const msg = error.response
              ? error.response.data.message || error.toString()
              : error.toString();
  
            Swal.fire({
              icon: 'error',
              title: 'Something went wrong!',
              text: msg,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            });
  
            actions.setStatus({
              errorResponse: msg
            });
            actions.setSubmitting(false);
          },
          onSuccess: (data) => {
            actions.setSubmitting(false);
            resetForm();
            setDateOfBirth('');
            Swal.fire({
              icon: 'success',
              title: 'User Registered',
              text: data.message,
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true
            });
          },
          onSettled: () => {
            cache.invalidateQueries('users');
          }
        });
      }
  });

  const { 
    errors, 
    touched, 
    values, 
    // isSubmitting, 
    handleSubmit, 
    getFieldProps, 
    resetForm 
  } = formik;


  const { isLoading, isError, data: users } = useUsers();

  const rows = useMemo(() => {
    if (!isLoading && !isError) {
      const listOfUsers = [];
      if (users?.pages?.length > 0) {
        users.pages.forEach((group) => listOfUsers.push(group.userList));
      }
      const flattened = listOfUsers.flat();
      return flattened;
    }
  }, [users, isLoading, isError]);

  // For Testing 
  // useEffect(() => {
  //   console.log("All Users:", rows);
  // }, [rows])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;
  
  const getValue = (_id) => { 
    return document.getElementById(_id).value;
  }
  
  const handleUserUpdate = (row) => {
    const dob = editable.dob ? getValue(`dob_${row._id}`) : row.dob;
    const data = {
      firstname: editable.firstname ? getValue(`firstname_${row._id}`) : row.firstname,
      lastname: editable.lastname ? getValue(`lastname_${row._id}`) : row.lastname,
      gender: editable.gender ? getValue(`gender_${row._id}`) : row.gender,
      email: editable.email ? getValue(`email_${row._id}`) : row.email,
      contact: editable.contact ? getValue(`contact_${row._id}`) : row.contact,
      dob: editable.dob ? convertUTCtoLocal(dob, true) : row.dob,
      address: editable.address ? getValue(`address_${row._id}`) : row.address
    }
    updateUserMutation(data, {
      onError: (error) => {
        // for unauthorized access
        if (error.response && error.response.status === 401) {
          // dispatch(logOut());
        }

        const msg = error.response
          ? error.response.data.message || error.toString()
          : error.toString();

        Swal.fire({
          icon: 'error',
          title: 'Something went wrong!',
          text: msg,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      },
      onSuccess: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'User Updated',
          text: data.message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      },
      onSettled: () => {
        cache.invalidateQueries('users');
      }
    });
  }

  const handleDob = (id,dob) => {
    dobList[id] = dob;
  }

  return (
    <Box container sx={{ p: 4 }}>
          <Paper sx={{ width: '100%', mb: 2, mt: 5}}>
            <EnhancedTableToolbar 
              numSelected={selected.length} 
              handleDelete={handleDeleteUsers}  
            />
            <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit} >
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows?.length ?? 0}
                />
                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                    <TableRow>
                      <TableCell>ADD</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                        <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField
                        variant="standard"
                        fullWidth
                        type="text"
                        label="First Name"
                        autoComplete="off"
                        required
                        {...getFieldProps('firstname')}
                        error={Boolean(touched.firstname && errors.firstname)}
                        helperText={touched.firstname && errors.firstname}
                        />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                        <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField
                        variant="standard"
                        fullWidth
                        type="text"
                        label="Last Name"
                        autoComplete="off"
                        required
                        {...getFieldProps('lastname')}
                        error={Boolean(touched.lastname && errors.lastname)}
                        helperText={touched.lastname && errors.lastname}
                        />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {/* Gender */}
                        <Box sx={{ display: 'flex', minWidth: '14rem', alignItems: 'flex-end' }}>
                          <WcIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="employee_gender">
                              Choose Gender
                            </InputLabel>
                            <Select
                              variant="standard"
                              inputProps={{
                                name: 'gender',
                                id: 'gender'
                              }}
                              required
                              sx={{ mt: 2 }}
                              {...getFieldProps('gender')}
                              error={Boolean(touched.gender && errors.gender)}
                              // helperText={touched.policy_role && errors.policy_role}
                            >
                              <MenuItem value="" disabled>
                                Choose Gender
                              </MenuItem>
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {/* Email */}
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                            variant="standard"
                            fullWidth
                            type="text"
                            label="Email"
                            autoComplete="off"
                            required
                            {...getFieldProps('email')}
                            error={Boolean(touched.email && errors.email)}
                            helperText={touched.email && errors.email}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {/* Mobile */}
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <ContactPhoneIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                            variant="standard"
                            fullWidth
                            type="text"
                            label="Mobile ( +91 )"
                            autoComplete="off"
                            required
                            {...getFieldProps('contact')}
                            error={Boolean(touched.contact && errors.contact)}
                            helperText={touched.contact && errors.contact}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        {/* Password */}
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <PasswordIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                            variant="standard"
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            autoComplete="off"
                            required
                            {...getFieldProps('password')}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleShowPassword} edge="end">
                                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            error={Boolean(touched.password && errors.password)}
                            helperText={touched.password && errors.password}
                          />
                        </Box>
                      </TableCell>
                      {/* <TableCell>
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <PasswordIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                            variant="standard"
                            fullWidth
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirm Passowrd"
                            autoComplete="off"
                            required
                            {...getFieldProps('confirmPassword')}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={handleShowConfirmPassword} edge="end">
                                    <Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
                                  </IconButton>
                                </InputAdornment>
                              )
                            }}
                            error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                            helperText={touched.confirmPassword && errors.confirmPassword}
                          />
                        </Box>
                      </TableCell> */}
                      <TableCell>
                         {/* Date Of Birth */}
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                            <EventIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <LocalizationProvider dateAdapter={AdapterDate}>
                              <DatePicker
                                label="Date Of Birth"
                                value={dateOfBirth}
                                onChange={(dateOfBirth) => {
                                  values.dateOfBirth = dateOfBirth;
                                  setDateOfBirth(values.dateOfBirth);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    fullWidth
                                    {...params}
                                    error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                                    helperText={touched.dateOfBirth && errors.dateOfBirth}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                      </TableCell>
                      <TableCell>
                         {/* Address */}
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                            <ContactsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField
                              variant="standard"
                              fullWidth
                              type="text"
                              label="Address"
                              autoComplete="off"
                              required
                              {...getFieldProps('address')}
                              error={Boolean(touched.address && errors.address)}
                              helperText={touched.address && errors.address}
                            />
                          </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          position: 'sticky',
                          right: 0,
                          background: 'white',
                          zIndex: 800,
                      }}
                      >
                        <Button
                        variant="contained"
                        sx={{float: 'right', minWidth: '9rem' }}
                        type="button"
                        onClick={handleSubmit}
                        >
                        <AddIcon />&nbsp;ADD USER
                        </Button>
                      </TableCell>
                    </TableRow>
                    {isLoading ? (
                          <TableRow>
                            <TableCell
                              colSpan="15"
                              className="loader__parent center-align"
                            >
                              
                              <span className="loading-message">
                                Loading employees...
                              </span>
                            </TableCell>
                          </TableRow>
                        ) : isError ? (
                          <TableRow>
                            <TableCell
                              colSpan="15"
                              className="loading-message loading-error center-align"
                            >
                              <i className="material-icons">error</i>
                              Something went wrong.
                            </TableCell>
                          </TableRow>
                  ) : rows && rows.length !== 0 ? (
                    stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          // hover
                          // onClick={(event) => handleClick(event, row._id)}
                          // role="checkbox"
                          // aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row._id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={!!selected.find(id => id === row._id)}
                              onClick={(event) => handleClick(event, row._id)}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                        {editable.firstname ? ( 
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                          variant="standard"
                          fullWidth
                          id={`firstname_${row._id}`}
                          defaultValue={row.firstname}
                          type="text"
                          label="First Name"
                          autoComplete="off"
                          required
                          />
                          </Box>
                        ) : ( row.firstname )
                        }
                          </TableCell>
                          <TableCell align="right">
                        {editable.lastname ? (  
                        <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                        <PersonIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                        <TextField
                        variant="standard"
                        defaultValue={row.lastname}
                        fullWidth
                        type="text"
                        id={`lastname_${row._id}`}
                        label="Last Name"
                        autoComplete="off"
                        required
                        />
                        </Box>
                        ) : ( row.lastname )
                        }
                        </TableCell>
                          <TableCell align="right">
                          {editable.gender ? (  
                          <Box sx={{ display: 'flex', minWidth: '14rem', alignItems: 'flex-end' }}>
                          <WcIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <FormControl fullWidth>
                            <InputLabel variant="standard" htmlFor="employee_gender">
                              Choose Gender
                            </InputLabel>
                            <Select
                              variant="standard"
                              inputProps={{
                                name: 'gender',
                                id: `gender_${row._id}`
                              }}
                              defaultValue={row.gender}
                              required
                              sx={{ mt: 2 }}
                            >
                              <MenuItem value="" disabled>
                                Choose Gender
                              </MenuItem>
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                              <MenuItem value="Other">Other</MenuItem>
                            </Select>
                          </FormControl>
                           </Box>
                          ) : ( row.gender )
                          }
                          </TableCell>
                          <TableCell align="right">
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <EmailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                            variant="standard"
                            defaultValue={row.email}
                            fullWidth
                            type="text"
                            id={`email_${row._id}`}
                            label="Email"
                            autoComplete="off"
                            required
                          />
                        </Box>
                          </TableCell>
                          <TableCell align="right">
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                          <ContactPhoneIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                          <TextField
                            variant="standard"
                            defaultValue={row.contact}
                            fullWidth
                            type="text"
                            label="Mobile ( +91 )"
                            id={`contact_${row._id}`}
                            autoComplete="off"
                            required
                          />
                        </Box>
                          </TableCell>
                          <TableCell align="right">{row.password ?? '************'}</TableCell>
                          <TableCell align="right">
                          {editable.dob ? (
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                            <EventIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <LocalizationProvider dateAdapter={AdapterDate}>
                              <DatePicker
                                label="Date Of Birth"
                                value={dobList[`${row._id}`] ? dobList[`${row._id}`] : row.dob }
                                onChange={(dateOfBirth) => handleDob(row._id, dateOfBirth)}
                                renderInput={(params) => (
                                  <TextField
                                    variant="standard"
                                    fullWidth
                                    id={`dob_${row._id}`}
                                    {...params}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          </Box>
                          ) : ( row.dob )
                          }
                          </TableCell>
                          <TableCell align="right">
                          <Box sx={{ display: 'flex', minWidth: '12rem', alignItems: 'flex-end' }}>
                            <ContactsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField
                              variant="standard"
                              fullWidth
                              defaultValue={row.address}
                              type="text"
                              id={`address_${row._id}`}
                              label="Address"
                              autoComplete="off"
                              required
                            />
                          </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              position: 'sticky',
                              right: 0,
                              background: 'white',
                              zIndex: 800,
                          }}>
                            <Button
                            type="button"
                              variant="contained"
                              onClick={() => handleUserUpdate(row)}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan="10"
                        className="input-labels center-align"
                        // align="center"
                      >
                        No employees to show
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Form>
            </FormikProvider>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows?.length ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}