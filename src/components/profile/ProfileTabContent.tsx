'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, TextField, Button, Alert, Snackbar } from '@mui/material';
import ProfilePictureEditor from '@/components/profile/ProfilePictureEditor';
import { useCompanyContext } from '@/contexts/CompanyContext';
import type { CompanyDto } from '@/lib/api/companies/types';

interface FormData {
  tenantName: string;
  tenantEmail: string;
  accountNumber: string;
  location: string;
  streetName: string;
  state: string;
  about: string;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
}

interface ProfileTabContentProps {
  company: CompanyDto;
}

export default function ProfileTabContent({ company }: ProfileTabContentProps) {
  const { updateCompany, isLoading: isContextLoading } = useCompanyContext();
  
  // Initialize form data from company
  const initializeFormData = useCallback((): FormData => ({
    tenantName: company.name || '',
    tenantEmail: company.emailAddress || '',
    accountNumber: company.accountNumber || '',
    location: company.location || '',
    streetName: '', // Not available in company object
    state: '', // Not available in company object
    about: company.description || '',
    field1: company.phoneNumber || '',
    field2: company.whatsappNumber || '',
    field3: company.tiktokUrl || '',
    field4: company.instagramUrl || '',
  }), [company]);

  // Form state
  const [formData, setFormData] = useState<FormData>(initializeFormData());

  // Initial values to track dirty state
  const [initialFormData, setInitialFormData] = useState<FormData>(initializeFormData());

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [initialProfilePicture, setInitialProfilePicture] = useState<File | null>(null);

  // Loading and error states
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update form when company data changes
  useEffect(() => {
    const newFormData = initializeFormData();
    setFormData(newFormData);
    setInitialFormData(newFormData);
    // Reset profile picture when company changes
    setProfilePicture(null);
    setInitialProfilePicture(null);
  }, [initializeFormData]);

  const userInitials = formData.tenantName ? `${formData.tenantName.charAt(0)}` : 'TN';

  // Check if form is dirty
  const isFormDirty = () => {
    const formChanged =
      formData.tenantName !== initialFormData.tenantName ||
      formData.tenantEmail !== initialFormData.tenantEmail ||
      formData.accountNumber !== initialFormData.accountNumber ||
      formData.location !== initialFormData.location ||
      formData.streetName !== initialFormData.streetName ||
      formData.state !== initialFormData.state ||
      formData.about !== initialFormData.about ||
      formData.field1 !== initialFormData.field1 ||
      formData.field2 !== initialFormData.field2 ||
      formData.field3 !== initialFormData.field3 ||
      formData.field4 !== initialFormData.field4;

    const pictureChanged = profilePicture !== initialProfilePicture;

    return formChanged || pictureChanged;
  };

  const handleInputChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleProfilePictureChange = (file: File) => {
    setProfilePicture(file);
  };

  /**
   * Convert File to base64 string
   */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async () => {
    if (isSaving || isContextLoading) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      // Convert logo file to base64 if a new file is selected
      // Otherwise, send empty string (API will keep existing logo)
      let logoBase64 = '';
      if (profilePicture) {
        logoBase64 = await fileToBase64(profilePicture);
      }

      // Map form data to UpdateCompanyRequestDto
      const updateData = {
        name: formData.tenantName.trim(),
        emailAddress: formData.tenantEmail.trim(),
        accountNumber: formData.accountNumber.trim(),
        location: formData.location.trim(),
        description: formData.about.trim(),
        phoneNumber: formData.field1.trim(),
        whatsappNumber: formData.field2.trim(),
        logo: logoBase64, // Base64 string or empty string
        tiktokUrl: formData.field3.trim(),
        instagramUrl: formData.field4.trim(),
        firebaseToken: company.firebaseToken || '',
        services: company.services?.map((service) => service.id) || [],
      };

      // Validate required fields
      if (!updateData.name || !updateData.emailAddress) {
        throw new Error('Name and email are required fields');
      }

      // Call update API
      await updateCompany(updateData);

      // Update initial values after successful save
      setInitialFormData({ ...formData });
      setInitialProfilePicture(profilePicture);
      setSaveSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile. Please try again.';
      setSaveError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseError = () => {
    setSaveError(null);
  };

  const handleCloseSuccess = () => {
    setSaveSuccess(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      {/* Error Snackbar */}
      <Snackbar
        open={!!saveError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {saveError}
        </Alert>
      </Snackbar>

      {/* Success Snackbar */}
      <Snackbar
        open={saveSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
      {/* Logo Label and Profile Picture Editor */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Roboto',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '150%',
            color: '#313339',
            mb: 2,
          }}
        >
          Logo
        </Typography>
        <ProfilePictureEditor
          src={company.logo || null}
          initials={userInitials}
          onChange={handleProfilePictureChange}
        />
      </Box>

      {/* Profile Edit Form */}
      <Box
        sx={{
          width: '100%',
        }}
      >
        <Grid container spacing={3}>
          {/* Name Tenant */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '71px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Name Tenant
              </Typography>
              <TextField
                fullWidth
                placeholder="Input your tenant's name"
                value={formData.tenantName}
                onChange={handleInputChange('tenantName')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    '& fieldset': {
                      borderColor: '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EDEDED',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#041C2C',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Email Tenant */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '71px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Email Tenant
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="input your tenant's email"
                value={formData.tenantEmail}
                onChange={handleInputChange('tenantEmail')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    '& fieldset': {
                      borderColor: '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EDEDED',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#041C2C',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Account number */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '71px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Account number
              </Typography>
              <TextField
                fullWidth
                placeholder="Input your tenant's account number"
                value={formData.accountNumber}
                onChange={handleInputChange('accountNumber')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    '& fieldset': {
                      borderColor: '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EDEDED',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#041C2C',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Location ( link google Maps) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '71px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Location ( link google Maps)
              </Typography>
              <TextField
                fullWidth
                placeholder="Input your link google maps"
                value={formData.location}
                onChange={handleInputChange('location')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    '& fieldset': {
                      borderColor: '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EDEDED',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#041C2C',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Street name */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '71px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Street name
              </Typography>
              <TextField
                fullWidth
                placeholder="Input your link google maps"
                value={formData.streetName}
                onChange={handleInputChange('streetName')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    '& fieldset': {
                      borderColor: '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EDEDED',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#041C2C',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* state */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '71px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                state
              </Typography>
              <TextField
                fullWidth
                placeholder="Input your link google maps"
                value={formData.state}
                onChange={handleInputChange('state')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '45px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDEDED',
                    '& fieldset': {
                      borderColor: '#EDEDED',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#EDEDED',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#041C2C',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Box>
          </Grid>

          {/* About Section */}
          <Grid size={{ xs: 12 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                About
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Input your tenant's description"
                value={formData.about}
                onChange={handleInputChange('about')}
                inputProps={{
                  maxLength: 500,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    minHeight: '119px',
                    padding: '12px 16px',
                    borderRadius: '7.5px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E4E7',
                    '& fieldset': {
                      borderColor: '#E2E4E7',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#E2E4E7',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#D2A298',
                      borderWidth: '1.5px',
                    },
                  },
                  '& .MuiInputBase-input': {
                    fontFamily: 'Roboto',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '150%',
                    color: '#333333',
                    padding: 0,
                    '&::placeholder': {
                      color: '#B0B0B0',
                      opacity: 1,
                    },
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  mt: 1,
                  alignSelf: 'flex-start',
                }}
              >
                {formData.about.length}/500
              </Typography>
            </Box>
          </Grid>

          {/* Inputs with Prefix - Field 1 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '72px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Configuration
              </Typography>
              <Box sx={{ display: 'flex', gap: 0, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EDEDED',
                    borderRadius: '8.5px 0 0 8.5px',
                    height: '46px',
                    padding: '0 8px',
                    border: '1px solid #EDEDED',
                    borderRight: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                    }}
                  >
                    +966
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Input text"
                  value={formData.field1}
                  onChange={handleInputChange('field1')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0 8.5px 8.5px 0',
                      backgroundColor: '#FFFFFF',
                      height: '46px',
                      padding: '12px 16px',
                      '& fieldset': {
                        borderColor: '#EDEDED',
                        borderWidth: '1px',
                        borderLeft: 'none',
                      },
                      '&:hover fieldset': {
                        borderColor: '#EDEDED',
                        borderLeft: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D2A298',
                        borderWidth: '1.5px',
                        borderLeft: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                      padding: 0,
                      '&::placeholder': {
                        color: '#B0B0B0',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Inputs with Prefix - Field 2 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '72px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Configuration
              </Typography>
              <Box sx={{ display: 'flex', gap: 0, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EDEDED',
                    borderRadius: '8.5px 0 0 8.5px',
                    height: '46px',
                    padding: '0 8px',
                    border: '1px solid #EDEDED',
                    borderRight: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                    }}
                  >
                    +966
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Input text"
                  value={formData.field2}
                  onChange={handleInputChange('field2')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0 8.5px 8.5px 0',
                      backgroundColor: '#FFFFFF',
                      height: '46px',
                      padding: '12px 16px',
                      '& fieldset': {
                        borderColor: '#EDEDED',
                        borderWidth: '1px',
                        borderLeft: 'none',
                      },
                      '&:hover fieldset': {
                        borderColor: '#EDEDED',
                        borderLeft: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D2A298',
                        borderWidth: '1.5px',
                        borderLeft: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                      padding: 0,
                      '&::placeholder': {
                        color: '#B0B0B0',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Inputs with Prefix - Field 3 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '72px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Configuration
              </Typography>
              <Box sx={{ display: 'flex', gap: 0, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EDEDED',
                    borderRadius: '8.5px 0 0 8.5px',
                    height: '46px',
                    padding: '0 8px',
                    border: '1px solid #EDEDED',
                    borderRight: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                    }}
                  >
                    +966
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Input text"
                  value={formData.field3}
                  onChange={handleInputChange('field3')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0 8.5px 8.5px 0',
                      backgroundColor: '#FFFFFF',
                      height: '46px',
                      padding: '12px 16px',
                      '& fieldset': {
                        borderColor: '#EDEDED',
                        borderWidth: '1px',
                        borderLeft: 'none',
                      },
                      '&:hover fieldset': {
                        borderColor: '#EDEDED',
                        borderLeft: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D2A298',
                        borderWidth: '1.5px',
                        borderLeft: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                      padding: 0,
                      '&::placeholder': {
                        color: '#B0B0B0',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Inputs with Prefix - Field 4 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                gap: '8px',
                width: '100%',
                minHeight: '72px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Roboto',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '12px',
                  lineHeight: '150%',
                  color: '#B0B0B0',
                  height: '18px',
                }}
              >
                Configuration
              </Typography>
              <Box sx={{ display: 'flex', gap: 0, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EDEDED',
                    borderRadius: '8.5px 0 0 8.5px',
                    height: '46px',
                    padding: '0 8px',
                    border: '1px solid #EDEDED',
                    borderRight: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                    }}
                  >
                    +966
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Input text"
                  value={formData.field4}
                  onChange={handleInputChange('field4')}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '0 8.5px 8.5px 0',
                      backgroundColor: '#FFFFFF',
                      height: '46px',
                      padding: '12px 16px',
                      '& fieldset': {
                        borderColor: '#EDEDED',
                        borderWidth: '1px',
                        borderLeft: 'none',
                      },
                      '&:hover fieldset': {
                        borderColor: '#EDEDED',
                        borderLeft: 'none',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D2A298',
                        borderWidth: '1.5px',
                        borderLeft: 'none',
                      },
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Roboto',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '150%',
                      color: '#333333',
                      padding: 0,
                      '&::placeholder': {
                        color: '#B0B0B0',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* Save Changes Button - Only show when form is dirty */}
          {isFormDirty() && (
            <Grid size={{ xs: 12 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving || isContextLoading}
                  sx={{
                    minWidth: '150px',
                    height: '44px',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 700,
                    backgroundColor: '#CFA09F',
                    '&:hover': {
                      backgroundColor: '#B8908F',
                    },
                    '&:disabled': {
                      backgroundColor: '#CFA09F',
                      opacity: 0.6,
                    },
                  }}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

