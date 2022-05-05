import * as mongoose from 'mongoose';
import { UserDoc } from '../../auth/models/user.model';
import { SpgwasDoc } from './spgwas.model';

export enum JobStatus {
  COMPLETED = 'completed',
  RUNNING = 'running',
  FAILED = 'failed',
  ABORTED = 'aborted',
  NOTSTARTED = 'not-started',
  QUEUED = 'queued',
}

//Interface that describe the properties that are required to create a new job
interface JobsAttrs {
  jobUID: string;
  job_name: string;
  status: JobStatus;
  user?: string;
  email?: string;
  inputFile: string;
  longJob: boolean;
}

// An interface that describes the extra properties that a model has
//collection level methods
interface JobsModel extends mongoose.Model<SpgwasJobsDoc> {
  build(attrs: JobsAttrs): SpgwasJobsDoc;
}

//An interface that describes a properties that a document has
export interface SpgwasJobsDoc extends mongoose.Document {
  id: string;
  jobUID: string;
  job_name: string;
  inputFile: string;
  status: JobStatus;
  user?: UserDoc;
  email?: string;
  failed_reason: string;
  longJob: boolean;
  spgwas_params: SpgwasDoc;
  clump_ResultsFile: string;
  coloc_ResultsFile: string;
  pascal_geneScoresFile: string;
  pascal_pathwaySetFile: string;
  pascal_fusionGenesFile: string;
  emagma_genes_out: string;
  emagma_manhattan_plot: string;
  emagma_tissue_genes_out: string;
  smr_cageSMRFile: string;
  smr_cageTransFile: string;
  smr_cageMultiFile: string;
  smr_cageSMRManhattanPlot: string;
  smr_cageMultiManhattanPlot: string;
  smr_tissueSMRFile: string;
  smr_tissueTransFile: string;
  smr_tissueMultiFile: string;
  smr_tissueSMRManhattanPlot: string;
  smr_tissueMultiManhattanPlot: string;
  smr_westraSMRFile: string;
  smr_westraTransFile: string;
  smr_westraMultiFile: string;
  smr_westraSMRManhattanPlot: string;
  smr_westraMultiManhattanPlot: string;
  delet_outputFile: string;
  delet_exon_plot: string;
  annot_outputFile: string;
  annot_disgenet: string;
  annot_snp_plot: string;
  annot_exon_plot: string;
  haplor_resultsFile: string;
  version: number;
  completionTime: Date;
}

const SpgwasJobSchema = new mongoose.Schema<SpgwasJobsDoc, JobsModel>(
  {
    jobUID: {
      type: String,
      required: [true, 'Please add a Job UID'],
      unique: true,
      trim: true,
    },
    job_name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    inputFile: {
      type: String,
      required: [true, 'Please add a input filename'],
      unique: true,
      trim: true,
    },
    clump_ResultsFile: {
      type: String,
      trim: true,
    },
    coloc_ResultsFile: {
      type: String,
      trim: true,
    },
    pascal_geneScoresFile: {
      type: String,
      trim: true,
    },
    pascal_pathwaySetFile: {
      type: String,
      trim: true,
    },
    pascal_fusionGenesFile: {
      type: String,
      trim: true,
    },
    emagma_genes_out: {
      type: String,
      trim: true,
    },
    emagma_tissue_genes_out: {
      type: String,
      trim: true,
    },
    emagma_manhattan_plot: {
      type: String,
      trim: true,
    },
    smr_cageSMRFile: {
      type: String,
      trim: true,
    },
    smr_cageTransFile: {
      type: String,
      trim: true,
    },
    smr_cageMultiFile: {
      type: String,
      trim: true,
    },
    smr_cageSMRManhattanPlot: {
      type: String,
      trim: true,
    },
    smr_cageMultiManhattanPlot: {
      type: String,
      trim: true,
    },
    smr_tissueSMRFile: {
      type: String,
      trim: true,
    },
    smr_tissueTransFile: {
      type: String,
      trim: true,
    },
    smr_tissueMultiFile: {
      type: String,
      trim: true,
    },
    smr_tissueSMRManhattanPlot: {
      type: String,
      trim: true,
    },
    smr_tissueMultiManhattanPlot: {
      type: String,
      trim: true,
    },
    smr_westraSMRFile: {
      type: String,
      trim: true,
    },
    smr_westraTransFile: {
      type: String,
      trim: true,
    },
    smr_westraMultiFile: {
      type: String,
      trim: true,
    },
    smr_westraSMRManhattanPlot: {
      type: String,
      trim: true,
    },
    smr_westraMultiManhattanPlot: {
      type: String,
      trim: true,
    },
    delet_outputFile: {
      type: String,
      trim: true,
    },
    delet_exon_plot: {
      type: String,
      trim: true,
    },
    annot_outputFile: {
      type: String,
      trim: true,
    },
    annot_disgenet: {
      type: String,
      trim: true,
    },
    annot_snp_plot: {
      type: String,
      trim: true,
    },
    annot_exon_plot: {
      type: String,
      trim: true,
    },
    haplor_ResultsFile: {
      type: String,
      trim: true,
    },
    failed_reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        JobStatus.COMPLETED,
        JobStatus.NOTSTARTED,
        JobStatus.RUNNING,
        JobStatus.FAILED,
        JobStatus.ABORTED,
        JobStatus.QUEUED,
      ],
      default: JobStatus.NOTSTARTED,
    },
    longJob: {
      type: Boolean,
      default: false,
    },
    completionTime: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toObject: { virtuals: true },
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
// jobsSchema.set("versionKey", "version");

//collection level methods
SpgwasJobSchema.statics.build = (attrs: JobsAttrs) => {
  return new SpgwasJobsModel(attrs);
};

//Cascade delete main job parameters when job is deleted
SpgwasJobSchema.pre('remove', async function (next) {
  console.log('Job parameters being removed!');
  await this.model('Spgwas').deleteMany({
    job: this.id,
  });
  next();
});

//reverse populate jobs with main job parameters
SpgwasJobSchema.virtual('spgwas_params', {
  ref: 'Spgwas',
  localField: '_id',
  foreignField: 'job',
  required: true,
  justOne: true,
});

SpgwasJobSchema.set('versionKey', 'version');

//create mongoose model
const SpgwasJobsModel = mongoose.model<SpgwasJobsDoc, JobsModel>(
  'SpgwasJob',
  SpgwasJobSchema,
  'spgwasjobs',
);

export { SpgwasJobsModel };
