'use client';

import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Button } from '@mui/material';
import ProfilePictureEditor from '@/components/profile/ProfilePictureEditor';

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
  initialData?: {
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    profilePicture?: string | null;
  };
}

export default function ProfileTabContent({ initialData }: ProfileTabContentProps) {
  const defaultData = {
    tenantName: '',
    tenantEmail: '',
    accountNumber: '',
    location: '',
    streetName: '',
    state: '',
    about: '',
    field1: '',
    field2: '',
    field3: '',
    field4: '',
    profilePicture: null,
  };

  const userData = initialData || defaultData;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    tenantName: defaultData.tenantName,
    tenantEmail: defaultData.tenantEmail,
    accountNumber: defaultData.accountNumber,
    location: defaultData.location,
    streetName: defaultData.streetName,
    state: defaultData.state,
    about: defaultData.about,
    field1: defaultData.field1,
    field2: defaultData.field2,
    field3: defaultData.field3,
    field4: defaultData.field4,
  });

  // Initial values to track dirty state
  const [initialFormData, setInitialFormData] = useState<FormData>({
    tenantName: defaultData.tenantName,
    tenantEmail: defaultData.tenantEmail,
    accountNumber: defaultData.accountNumber,
    location: defaultData.location,
    streetName: defaultData.streetName,
    state: defaultData.state,
    about: defaultData.about,
    field1: defaultData.field1,
    field2: defaultData.field2,
    field3: defaultData.field3,
    field4: defaultData.field4,
  });

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [initialProfilePicture, setInitialProfilePicture] = useState<File | null>(null);

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

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile:', formData);
    if (profilePicture) {
      console.log('Saving profile picture:', profilePicture);
    }

    // Update initial values after save
    setInitialFormData({ ...formData });
    setInitialProfilePicture(profilePicture);
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
          src={userData.profilePicture || null}
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
                  sx={{
                    minWidth: '150px',
                    height: '44px',
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
}

