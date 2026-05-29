import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { JobsService } from './jobs.service';
import { Job } from './models/job.model';
import { SavedJob } from './models/saved-job.model';

/* ─── Minimal model mocks ─── */
const mockJobModel = {
  findAndCountAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
};

const mockSavedJobModel = {
  findOrCreate: jest.fn(),
  destroy: jest.fn(),
  findAll: jest.fn(),
};

describe('JobsService', () => {
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: getModelToken(Job), useValue: mockJobModel },
        { provide: getModelToken(SavedJob), useValue: mockSavedJobModel },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jest.clearAllMocks();
  });

  /* ─── saveJob ─── */
  describe('saveJob', () => {
    it('should call findOrCreate with the correct where/defaults', async () => {
      const mockRecord = { id: 'sr1', user_id: 'u1', job_id: 'j1' };
      mockSavedJobModel.findOrCreate.mockResolvedValue([mockRecord, true]);

      const result = await service.saveJob('u1', 'j1');

      expect(mockSavedJobModel.findOrCreate).toHaveBeenCalledTimes(1);
      expect(mockSavedJobModel.findOrCreate).toHaveBeenCalledWith({
        where: { user_id: 'u1', job_id: 'j1' },
        defaults: { user_id: 'u1', job_id: 'j1' },
      });
      expect(result).toBe(mockRecord);
    });

    it('should return existing record when job already saved (created=false)', async () => {
      const existingRecord = { id: 'sr2', user_id: 'u2', job_id: 'j2' };
      mockSavedJobModel.findOrCreate.mockResolvedValue([existingRecord, false]);

      const result = await service.saveJob('u2', 'j2');

      expect(result).toBe(existingRecord);
    });
  });

  /* ─── unsaveJob ─── */
  describe('unsaveJob', () => {
    it('should call destroy with the correct where clause', async () => {
      mockSavedJobModel.destroy.mockResolvedValue(1);

      const result = await service.unsaveJob('u1', 'j1');

      expect(mockSavedJobModel.destroy).toHaveBeenCalledWith({
        where: { user_id: 'u1', job_id: 'j1' },
      });
      expect(result).toEqual({ success: true });
    });

    it('should still return success even if no record matched (idempotent)', async () => {
      mockSavedJobModel.destroy.mockResolvedValue(0);

      const result = await service.unsaveJob('u1', 'non-existent');

      expect(result).toEqual({ success: true });
    });
  });

  /* ─── getSavedJobs ─── */
  describe('getSavedJobs', () => {
    it('should return the mapped jobs from saved records', async () => {
      const job1 = { id: 'j1', title: 'Sales Executive', company: { name: 'ACME' } };
      const job2 = { id: 'j2', title: 'Accountant', company: { name: 'XYZ Corp' } };
      mockSavedJobModel.findAll.mockResolvedValue([{ job: job1 }, { job: job2 }]);

      const result = await service.getSavedJobs('u1');

      expect(mockSavedJobModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 'u1' } }),
      );
      expect(result).toEqual([job1, job2]);
    });

    it('should filter out null job associations', async () => {
      const validJob = { id: 'j1', title: 'Driver' };
      mockSavedJobModel.findAll.mockResolvedValue([
        { job: null },
        { job: validJob },
        { job: undefined },
      ]);

      const result = await service.getSavedJobs('u1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(validJob);
    });

    it('should return empty array when user has no saved jobs', async () => {
      mockSavedJobModel.findAll.mockResolvedValue([]);

      const result = await service.getSavedJobs('u1');

      expect(result).toEqual([]);
    });

    it('should order results by created_at DESC', async () => {
      mockSavedJobModel.findAll.mockResolvedValue([]);

      await service.getSavedJobs('u1');

      expect(mockSavedJobModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ order: [['created_at', 'DESC']] }),
      );
    });
  });

  /* ─── findAll date_posted filter ─── */
  describe('findAll — date_posted filter', () => {
    it('should apply a created_at gte filter when date_posted is set', async () => {
      mockJobModel.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });
      const before = Date.now();

      await service.findAll({ date_posted: '24h' } as any);

      const callArg = mockJobModel.findAndCountAll.mock.calls[0][0];
      const cutoff: Date = callArg.where.created_at?.['$gte'] ?? callArg.where.created_at?.[Symbol.for('gte')];
      // Check that a date filter was applied within a reasonable window
      expect(cutoff).toBeDefined();
      const cutoffTime = new Date(cutoff).getTime();
      expect(cutoffTime).toBeGreaterThan(before - 2 * 24 * 60 * 60 * 1000); // at most 2 days ago
      expect(cutoffTime).toBeLessThanOrEqual(before); // not in the future
    });

    it('should NOT apply a date filter when date_posted is "all"', async () => {
      mockJobModel.findAndCountAll.mockResolvedValue({ count: 0, rows: [] });

      await service.findAll({ date_posted: 'all' } as any);

      const callArg = mockJobModel.findAndCountAll.mock.calls[0][0];
      expect(callArg.where.created_at).toBeUndefined();
    });
  });
});
