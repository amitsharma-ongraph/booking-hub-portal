'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme, Card, Alert } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';
import CategoryCard, { CategoryOption } from '@/components/categories/CategoryCard';
import EditCategoryModal from '@/components/categories/EditCategoryModal';
import AddCategoryModal from '@/components/categories/AddCategoryModal';
import AddOptionModal from '@/components/categories/AddOptionModal';
import DeleteCategoryModal from '@/components/categories/DeleteCategoryModal';
import EditOptionModal from '@/components/categories/EditOptionModal';
import DeleteOptionModal from '@/components/categories/DeleteOptionModal';
import { useCategoriesContext } from '@/contexts/CategoriesContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { categoriesService } from '@/lib/api/categories/categoriesService';
import LoadingSpinner from '@/components/loaders/LoadingSpinner';
import type { CategoryDto } from '@/lib/api/categories/types';

export default function CategoriesPage() {
  const theme = useTheme();
  const { categories, isLoading, error, refreshCategories, addCategory, updateCategory, removeCategory, addOptionToCategory, updateOptionInCategory, removeOptionFromCategory } = useCategoriesContext();
  const { user } = useAuthContext();

  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
  const [addingToCategory, setAddingToCategory] = useState<CategoryDto | null>(null);
  const [isAddingOption, setIsAddingOption] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<CategoryDto | null>(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [editOptionModalOpen, setEditOptionModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<{ categoryId: string; option: CategoryOption } | null>(null);
  const [isUpdatingOption, setIsUpdatingOption] = useState(false);
  const [deleteOptionModalOpen, setDeleteOptionModalOpen] = useState(false);
  const [deletingOption, setDeletingOption] = useState<{ categoryId: string; option: CategoryOption } | null>(null);
  const [isDeletingOption, setIsDeletingOption] = useState(false);

  const handleEditCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setEditingCategory(category);
      setEditModalOpen(true);
    }
  };

  // Fetch categories on mount if not already loaded
  useEffect(() => {
    if (user?.id && categories.length === 0 && !isLoading) {
      refreshCategories();
    }
  }, [user?.id, categories.length, isLoading, refreshCategories]);

  const handleSaveCategory = async (name: string) => {
    if (!editingCategory) {
      return;
    }

    setIsUpdatingCategory(true);
    try {
      // Call the API to update the category
      const response = await categoriesService.updateCategory(editingCategory.id, {
        name,
      });

      // Update state with the response from API (includes id, name)
      updateCategory(editingCategory.id, {
        id: response.id,
        name: response.name,
      });

      // Close modal and reset state on success
      setEditModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
      // Error is handled - modal stays open so user can retry
      throw error; // Re-throw so modal knows save failed
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingCategory(null);
  };

  const handleAddOption = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      setAddingToCategory(category);
      setAddOptionModalOpen(true);
    }
  };

  const handleSaveOption = async (name: string, price: number) => {
    if (!addingToCategory) {
      return;
    }

    setIsAddingOption(true);
    try {
      // Call the API to create the option
      const response = await categoriesService.createOption({
        categoryId: addingToCategory.id,
        name,
        price,
      });

      // Update state with the response from API (includes id, name, price)
      addOptionToCategory(addingToCategory.id, {
        id: response.id,
        name: response.name,
        price: response.price,
      });

      // Close modal and reset state on success
      setAddOptionModalOpen(false);
      setAddingToCategory(null);
    } catch (error) {
      console.error('Failed to create option:', error);
      // Error is handled - modal stays open so user can retry
      throw error; // Re-throw so modal knows save failed
    } finally {
      setIsAddingOption(false);
    }
  };

  const handleCloseAddOptionModal = () => {
    setAddOptionModalOpen(false);
    setAddingToCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setDeletingCategory(category);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) {
      return;
    }

    setIsDeletingCategory(true);
    try {
      // Call the API to delete the category
      await categoriesService.deleteCategory(deletingCategory.id);

      // Update state to remove the category
      removeCategory(deletingCategory.id);

      // Close modal and reset state on success
      setDeleteModalOpen(false);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      // Error is handled - modal stays open so user can retry
      throw error; // Re-throw so modal knows delete failed
    } finally {
      setIsDeletingCategory(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeletingCategory(null);
  };

  const handleEditOption = (categoryId: string, optionId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      const option = category.options.find((opt) => opt.id === optionId);
      if (option) {
        setEditingOption({ categoryId, option });
        setEditOptionModalOpen(true);
      }
    }
  };

  const handleSaveEditOption = async (name: string, price: number) => {
    if (!editingOption) {
      return;
    }

    setIsUpdatingOption(true);
    try {
      // Call the API to update the option
      const response = await categoriesService.updateOption(
        editingOption.categoryId,
        editingOption.option.id,
        {
          name,
          price,
        }
      );

      // Update state with the response from API (includes id, name, price)
      updateOptionInCategory(editingOption.categoryId, editingOption.option.id, {
        id: response.id,
        name: response.name,
        price: response.price,
      });

      // Close modal and reset state on success
      setEditOptionModalOpen(false);
      setEditingOption(null);
    } catch (error) {
      console.error('Failed to update option:', error);
      // Error is handled - modal stays open so user can retry
      throw error; // Re-throw so modal knows save failed
    } finally {
      setIsUpdatingOption(false);
    }
  };

  const handleCloseEditOptionModal = () => {
    setEditOptionModalOpen(false);
    setEditingOption(null);
  };

  const handleDeleteOption = (categoryId: string, optionId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (category) {
      const option = category.options.find((opt) => opt.id === optionId);
      if (option) {
        setDeletingOption({ categoryId, option });
        setDeleteOptionModalOpen(true);
      }
    }
  };

  const handleConfirmDeleteOption = async () => {
    if (!deletingOption) {
      return;
    }

    setIsDeletingOption(true);
    try {
      // Call the API to delete the option
      await categoriesService.deleteOption(deletingOption.categoryId, deletingOption.option.id);

      // Update state to remove the option
      removeOptionFromCategory(deletingOption.categoryId, deletingOption.option.id);

      // Close modal and reset state on success
      setDeleteOptionModalOpen(false);
      setDeletingOption(null);
    } catch (error) {
      console.error('Failed to delete option:', error);
      // Error is handled - modal stays open so user can retry
      throw error; // Re-throw so modal knows delete failed
    } finally {
      setIsDeletingOption(false);
    }
  };

  const handleCloseDeleteOptionModal = () => {
    setDeleteOptionModalOpen(false);
    setDeletingOption(null);
  };

  const handleAddCategory = () => {
    setAddCategoryModalOpen(true);
  };

  const handleSaveAddCategory = async (name: string) => {
    if (!user?.id) {
      console.error('User ID not available');
      return;
    }

    setIsAddingCategory(true);
    try {
      // Call the API to create the category
      const response = await categoriesService.createCategory({
        companyId: user.id,
        name,
      });

      // Update state with the response from API (includes id, name, options)
      addCategory({
        id: response.id,
        name: response.name,
        options: response.options,
      });

      // Close modal on success
      setAddCategoryModalOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
      // Error is handled - modal stays open so user can retry
      throw error; // Re-throw so modal knows save failed
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleCloseAddCategoryModal = () => {
    setAddCategoryModalOpen(false);
  };

  return (
    <MainLayout>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
        }}
      >
        {/* Categories Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: { xs: 'auto', sm: '66.77px' },
            minHeight: '66.77px',
            mb: { xs: 3, sm: 4 },
            gap: 2,
          }}
        >
          {/* Categories Heading and Subheading */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          >
            <Typography
              sx={{
                color: '#0A0A0A',
                fontSize: '28px',
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              Categories
            </Typography>
            <Typography
              sx={{
                color: '#6A7282',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              Manage your service categories
            </Typography>
          </Box>

          {/* Add Category Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: '20px' }} />}
            onClick={handleAddCategory}
            sx={{
              backgroundColor: '#CFA09F',
              color: '#FFFFFF',
              borderRadius: '4px',
              width: { xs: 'auto', sm: '148px' },
              height: '41px',
              minWidth: '148px',
              padding: '0px 16px',
              fontSize: '14px',
              fontWeight: 400,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#B8908F',
                boxShadow: 'none',
              },
              '&:active': {
                backgroundColor: '#A6807F',
              },
            }}
          >
            Add Category
          </Button>
        </Box>

        {/* Error Display */}
        {error && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error" onClose={() => {}}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Categories Card - Outer Card with rounded corners */}
        <Box
          sx={{
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            p:'24px'
          }}
        >
          {/* Inner White Card */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              boxShadow: 'none',
              borderRadius: 0,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {/* Header Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                width: '100%',
                height: '44.51px',
                borderBottom: '0.890263px solid rgba(0, 0, 0, 0.1)',
                padding: 0,
                boxSizing: 'border-box',
                mb:"10px"
              }}
            >
              {/* First Section: Category Name and Options */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '44.51px',
                  paddingLeft: '8.9px',
                  paddingRight: '8.9px',
                }}
              >
                {/* Category Name - Left */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '15.5796px',
                      lineHeight: '22px',
                      color: '#808080',
                    }}
                  >
                    Category Name
                  </Typography>
                </Box>

                {/* Options - Right */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '15.5796px',
                      lineHeight: '22px',
                      color: '#808080',
                    }}
                  >
                    Options
                  </Typography>
                </Box>
              </Box>

              {/* Second Section: Actions - Centered */}
              <Box
                sx={{
                  flex: 1,
                  height: '44.51px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '8.9px',
                  paddingRight: '8.9px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '15.5796px',
                    lineHeight: '22px',
                    color: '#808080',
                  }}
                >
                  Actions
                </Typography>
              </Box>
            </Box>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 8,
                  width: '100%',
                }}
              >
                <LoadingSpinner text="Loading" />
              </Box>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  options={category.options}
                  onEdit={handleEditCategory}
                  onAddOption={handleAddOption}
                  onDelete={handleDeleteCategory}
                  onEditOption={handleEditOption}
                  onDeleteOption={handleDeleteOption}
                />
              ))
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  py: 8,
                }}
              >
                <Typography
                  sx={{
                    color: '#808080',
                    fontSize: '14px',
                    fontWeight: 400,
                  }}
                >
                  No categories available. Click "Add Category" to create one.
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      {/* Add Category Modal */}
      <AddCategoryModal
        open={addCategoryModalOpen}
        onClose={handleCloseAddCategoryModal}
        onSave={handleSaveAddCategory}
        isLoading={isAddingCategory}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        open={editModalOpen}
        onClose={handleCloseModal}
        categoryName={editingCategory?.name || ''}
        onSave={handleSaveCategory}
        isLoading={isUpdatingCategory}
      />

      {/* Add Option Modal */}
      <AddOptionModal
        open={addOptionModalOpen}
        onClose={handleCloseAddOptionModal}
        onSave={handleSaveOption}
        isLoading={isAddingOption}
      />

      {/* Delete Category Modal */}
      <DeleteCategoryModal
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        categoryName={deletingCategory?.name || ''}
        onDelete={handleConfirmDelete}
        isLoading={isDeletingCategory}
      />

      {/* Edit Option Modal */}
      <EditOptionModal
        open={editOptionModalOpen}
        onClose={handleCloseEditOptionModal}
        optionName={editingOption?.option.name || ''}
        optionPrice={editingOption?.option.price || 0}
        onSave={handleSaveEditOption}
        isLoading={isUpdatingOption}
      />

      {/* Delete Option Modal */}
      <DeleteOptionModal
        open={deleteOptionModalOpen}
        onClose={handleCloseDeleteOptionModal}
        optionName={deletingOption?.option.name || ''}
        onDelete={handleConfirmDeleteOption}
        isLoading={isDeletingOption}
      />
    </MainLayout>
  );
}
