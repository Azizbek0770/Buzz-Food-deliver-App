import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../../store/slices/categorySlice';
import Button from '../../common/Button';
import './CategoryList.css';

const CategoryList = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector(state => state.category);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <div>Yuklanmoqda...</div>;

  return (
    <div className="category-list">
      <Button 
        variant={selectedCategory === 'all' ? 'primary' : 'outline'}
        onClick={() => setSelectedCategory('all')}
      >
        Barcha taomlar
      </Button>
      
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'primary' : 'outline'}
          onClick={() => setSelectedCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategoryList; 