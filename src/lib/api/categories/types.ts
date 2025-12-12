/**
 * Categories API Types
 * Type definitions for category-related API responses
 */

export interface CategoryOptionDto {
  id: string;
  name: string;
  price: number;
}

export interface CategoryDto {
  id: string;
  name: string;
  options: CategoryOptionDto[];
}

export interface CreateOptionRequestDto {
  categoryId: string;
  name: string;
  price: number;
}

export interface CreateOptionResponseDto {
  id: string;
  name: string;
  price: number;
}

export interface UpdateCategoryRequestDto {
  name: string;
}

export interface UpdateCategoryResponseDto {
  id: string;
  name: string;
}

export interface UpdateOptionRequestDto {
  name: string;
  price: number;
}

export interface UpdateOptionResponseDto {
  id: string;
  name: string;
  price: number;
}

export interface CreateCategoryRequestDto {
  companyId: string;
  name: string;
}

export interface CreateCategoryResponseDto {
  id: string;
  name: string;
  options: CategoryOptionDto[];
}
