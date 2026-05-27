import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidatesService } from '../../services/candidates.service';
import { CandidateProfile, WorkExperience, Education, Certification } from '../../types';

interface CandidateState {
  profile: CandidateProfile | null;
  workExperiences: WorkExperience[];
  educations: Education[];
  certifications: Certification[];
  profileCompletion: number;
  loading: boolean;
  uploadingResume: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  profile: null,
  workExperiences: [],
  educations: [],
  certifications: [],
  profileCompletion: 0,
  loading: false,
  uploadingResume: false,
  error: null,
};

export const fetchFullProfile = createAsyncThunk(
  'candidates/fetchFullProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await candidatesService.getProfile();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  },
);

export const updateProfile = createAsyncThunk(
  'candidates/updateProfile',
  async (data: Partial<CandidateProfile>, { rejectWithValue }) => {
    try {
      return await candidatesService.updateProfile(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  },
);

export const uploadResume = createAsyncThunk(
  'candidates/uploadResume',
  async (file: File, { rejectWithValue }) => {
    try {
      return await candidatesService.uploadResume(file);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to upload resume');
    }
  },
);

export const addWorkExperience = createAsyncThunk(
  'candidates/addWorkExperience',
  async (data: Partial<WorkExperience>, { rejectWithValue }) => {
    try {
      return await candidatesService.addWorkExperience(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add work experience');
    }
  },
);

export const updateWorkExperience = createAsyncThunk(
  'candidates/updateWorkExperience',
  async ({ id, data }: { id: string; data: Partial<WorkExperience> }, { rejectWithValue }) => {
    try {
      return await candidatesService.updateWorkExperience(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update work experience');
    }
  },
);

export const deleteWorkExperience = createAsyncThunk(
  'candidates/deleteWorkExperience',
  async (id: string, { rejectWithValue }) => {
    try {
      await candidatesService.deleteWorkExperience(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete work experience');
    }
  },
);

export const addEducation = createAsyncThunk(
  'candidates/addEducation',
  async (data: Partial<Education>, { rejectWithValue }) => {
    try {
      return await candidatesService.addEducation(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add education');
    }
  },
);

export const updateEducation = createAsyncThunk(
  'candidates/updateEducation',
  async ({ id, data }: { id: string; data: Partial<Education> }, { rejectWithValue }) => {
    try {
      return await candidatesService.updateEducation(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update education');
    }
  },
);

export const deleteEducation = createAsyncThunk(
  'candidates/deleteEducation',
  async (id: string, { rejectWithValue }) => {
    try {
      await candidatesService.deleteEducation(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete education');
    }
  },
);

export const addCertification = createAsyncThunk(
  'candidates/addCertification',
  async (data: Partial<Certification>, { rejectWithValue }) => {
    try {
      return await candidatesService.addCertification(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add certification');
    }
  },
);

export const updateCertification = createAsyncThunk(
  'candidates/updateCertification',
  async ({ id, data }: { id: string; data: Partial<Certification> }, { rejectWithValue }) => {
    try {
      return await candidatesService.updateCertification(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update certification');
    }
  },
);

export const deleteCertification = createAsyncThunk(
  'candidates/deleteCertification',
  async (id: string, { rejectWithValue }) => {
    try {
      await candidatesService.deleteCertification(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete certification');
    }
  },
);

const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    clearCandidateError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFullProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFullProfile.fulfilled, (state, action) => {
        state.loading = false;
        const { profile, profileCompletion } = action.payload;
        state.profile = profile;
        state.workExperiences = profile?.workExperiences || [];
        state.educations = profile?.educations || [];
        state.certifications = profile?.certifications || [];
        state.profileCompletion = profileCompletion || 0;
      })
      .addCase(fetchFullProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const { profile, profileCompletion } = action.payload;
        state.profile = profile;
        state.workExperiences = profile?.workExperiences || [];
        state.educations = profile?.educations || [];
        state.certifications = profile?.certifications || [];
        state.profileCompletion = profileCompletion || 0;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(uploadResume.pending, (state) => {
        state.uploadingResume = true;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploadingResume = false;
        const { profile, profileCompletion } = action.payload;
        if (profile) state.profile = profile;
        state.workExperiences = profile?.workExperiences || [];
        state.educations = profile?.educations || [];
        state.certifications = profile?.certifications || [];
        state.profileCompletion = profileCompletion || 0;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploadingResume = false;
        state.error = action.payload as string;
      })
      .addCase(addWorkExperience.fulfilled, (state, action) => {
        state.workExperiences.push(action.payload as WorkExperience);
      })
      .addCase(updateWorkExperience.fulfilled, (state, action) => {
        const updated = action.payload as WorkExperience;
        state.workExperiences = state.workExperiences.map(w => w.id === updated.id ? updated : w);
      })
      .addCase(deleteWorkExperience.fulfilled, (state, action) => {
        state.workExperiences = state.workExperiences.filter(w => w.id !== action.payload);
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.educations.push(action.payload as Education);
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        const updated = action.payload as Education;
        state.educations = state.educations.map(e => e.id === updated.id ? updated : e);
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.educations = state.educations.filter(e => e.id !== action.payload);
      })
      .addCase(addCertification.fulfilled, (state, action) => {
        state.certifications.push(action.payload as Certification);
      })
      .addCase(updateCertification.fulfilled, (state, action) => {
        const updated = action.payload as Certification;
        state.certifications = state.certifications.map(c => c.id === updated.id ? updated : c);
      })
      .addCase(deleteCertification.fulfilled, (state, action) => {
        state.certifications = state.certifications.filter(c => c.id !== action.payload);
      });
  },
});

export const { clearCandidateError } = candidateSlice.actions;
export default candidateSlice.reducer;
