import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addProduct } from '../features/productsSlice';
import { TextField, Button, Box, Typography } from '@mui/material';

const CreateProductPage: React.FC = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      image: Yup.string().url('Invalid URL').required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(
        addProduct({
          id: Math.random().toString(),
          ...values,
          liked: false,
        })
      );
      formik.resetForm();
    },
  });
  
  return (
    <Box sx={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Create Product
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Image URL"
          name="image"
          value={formik.values.image}
          onChange={formik.handleChange}
          error={formik.touched.image && Boolean(formik.errors.image)}
          helperText={formik.touched.image && formik.errors.image}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem' }}>
          Create
        </Button>
      </form>
    </Box>
  );
};

export default CreateProductPage;