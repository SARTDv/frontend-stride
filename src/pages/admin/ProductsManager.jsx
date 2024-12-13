import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductForm } from './ProductForm';
import { ProductList } from './ProductList';
import styles from '../../css/admin.module.css';

export function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    // Obtener productos al cargar el componente
    axios.get('https://backend-stride.onrender.com/api/products/admin/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the products!", error);
      });
  }, []);

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      // Actualizar el producto
      axios.put(`https://backend-stride.onrender.comapi/products/admin/products/${product.id}/`, product)
        .then(response => {
          setProducts(products.map(p => p.id === product.id ? response.data : p));
          setShowForm(false);
          setEditingProduct(null);
        })
        .catch(error => {
          console.error("There was an error updating the product!", error);
        });
    } else {
      // Crear un nuevo producto
      axios.post('https://backend-stride.onrender.com/api/products/admin/products/', product)
        .then(response => {
          setProducts([...products, response.data]);
          setShowForm(false);
        })
        .catch(error => {
          console.error("There was an error creating the product!", error);
        });
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    console.log(product.imageurl)
    setShowForm(true);
  };

  const handleDelete = (productId) => {
    axios.delete(`https://backend-stride.onrender.com/api/products/admin/products/${productId}/`)
      .then(() => {
        setProducts(products.filter(p => p.id !== productId));
      })
      .catch(error => {
        console.error("There was an error deleting the product!", error);
      });
  };

  return (
    <div className={styles["products-manager"]}>
      <div className={styles["header-actions"]}>
        <h2>Product Management</h2>
        <button 
          className={`${styles.btn} ${styles["btn-primary"]}`}
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
        >
          Add New Product
        </button>
      </div>

      {showForm ? (
        <ProductForm 
          product={editingProduct}
          onSave={handleSaveProduct}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      ) : (
        <ProductList 
          products={products}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
