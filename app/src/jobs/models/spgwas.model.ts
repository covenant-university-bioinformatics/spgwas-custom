import * as mongoose from 'mongoose';

export enum YesNoOptions {
  YES = 'Yes',
  NO = 'No',
}

export enum OnOffOptions {
  ON = 'on',
  OFF = 'off',
}

export enum TrueFalseOptions {
  TRUE = 'true',
  FALSE = 'false',
}

export enum GeneScoring {
  MAX = 'max',
  SUM = 'sum',
}

export enum ColocTypeOptions {
  QUANTIFICATION = 'quant',
  CASECONTROL = 'cc',
}

export enum SynonymousSNPS {
  NO = 'No',
  DROP = 'drop',
  DROP_DUP = 'drop-dup',
  SKIP = 'skip',
  SKIP_DUP = 'skip_dup',
}

export enum GeneDB {
  REFSEQ = 'refseq',
  UCSC = 'knownGene',
  ENSEMBL = 'ensGene',
}

export enum GeneListOptions {
  GLISTHG19 = 'glist-hg19',
  GLISTHG38 = 'glist-hg38',
}

export enum EPITypes {
  VANILLA = 'vanilla',
  IMPUTED = 'imputed',
  METHYL = 'methyl',
}

export enum CONSTypes {
  GERP = 'gerp',
  SIPHY = 'siphy',
  BOTH = 'both',
}

export enum Genetypes {
  GENCODE = 'gencode',
  REFSEQ = 'refseq',
}

export enum Populations {
  AFR = 'afr',
  AMR = 'amr',
  EUR = 'eur',
  EAS = 'eas',
  SAS = 'sas',
}

export enum ChromosomesAll {
  CHR1 = '1',
  CHR2 = '2',
  CHR3 = '3',
  CHR4 = '4',
  CHR5 = '5',
  CHR6 = '6',
  CHR7 = '7',
  CHR8 = '8',
  CHR9 = '9',
  CHR10 = '10',
  CHR11 = '11',
  CHR12 = '12',
  CHR13 = '13',
  CHR14 = '14',
  CHR15 = '15',
  CHR16 = '16',
  CHR17 = '17',
  CHR18 = '18',
  CHR19 = '19',
  CHR20 = '20',
  CHR21 = '21',
  CHR22 = '22',
  ALL = 'all',
}

export enum ChromosomesXY {
  CHR1 = '1',
  CHR2 = '2',
  CHR3 = '3',
  CHR4 = '4',
  CHR5 = '5',
  CHR6 = '6',
  CHR7 = '7',
  CHR8 = '8',
  CHR9 = '9',
  CHR10 = '10',
  CHR11 = '11',
  CHR12 = '12',
  CHR13 = '13',
  CHR14 = '14',
  CHR15 = '15',
  CHR16 = '16',
  CHR17 = '17',
  CHR18 = '18',
  CHR19 = '19',
  CHR20 = '20',
  CHR21 = '21',
  CHR22 = '22',
  CHRX = 'X',
  CHRY = 'Y',
}

export enum TISSUEOptions {
  Adipose_Subcutaneous = 'Adipose_Subcutaneous',
  Adipose_Visceral_Omentum = 'Adipose_Visceral_Omentum',
  Adrenal_Gland = 'Adrenal_Gland',
  Artery_Aorta = 'Artery_Aorta',
  Artery_Coronary = 'Artery_Coronary',
  Artery_Tibial = 'Artery_Tibial',
  Brain_Amygdala = 'Brain_Amygdala',
  Brain_Anterior_cingulate_cortex_BA24 = 'Brain_Anterior_cingulate_cortex_BA24',
  Brain_Caudate_basal_ganglia = 'Brain_Caudate_basal_ganglia',
  Brain_Cerebellar_Hemisphere = 'Brain_Cerebellar_Hemisphere',
  Brain_Cerebellum = 'Brain_Cerebellum',
  Brain_Cortex = 'Brain_Cortex',
  Brain_Frontal_Cortex_BA9 = 'Brain_Frontal_Cortex_BA9',
  Brain_Hippocampus = 'Brain_Hippocampus',
  Brain_Hypothalamus = 'Brain_Hypothalamus',
  Brain_Nucleus_accumbens_basal_ganglia = 'Brain_Nucleus_accumbens_basal_ganglia',
  Brain_Putamen_basal_ganglia = 'Brain_Putamen_basal_ganglia',
  Brain_Spinal_cord_cervical_c_1 = 'Brain_Spinal_cord_cervical_c_1',
  Brain_Substantia_nigra = 'Brain_Substantia_nigra',
  Breast_Mammary_Tissue = 'Breast_Mammary_Tissue',
  Cells_Cultured_fibroblasts = 'Cells_Cultured_fibroblasts',
  Cells_EBV_transformed_lymphocytes = 'Cells_EBV_transformed_lymphocytes',
  Colon_Sigmoid = 'Colon_Sigmoid',
  Colon_Transverse = 'Colon_Transverse',
  Esophagus_Gastroesophageal_Junction = 'Esophagus_Gastroesophageal_Junction',
  Esophagus_Mucosa = 'Esophagus_Mucosa',
  Esophagus_Muscularis = 'Esophagus_Muscularis',
  Heart_Atrial_Appendage = 'Heart_Atrial_Appendage',
  Heart_Left_Ventricle = 'Heart_Left_Ventricle',
  Kidney_Cortex = 'Kidney_Cortex',
  Liver = 'Liver',
  Lung = 'Lung',
  Minor_Salivary_Gland = 'Minor_Salivary_Gland',
  Muscle_Skeletal = 'Muscle_Skeletal',
  Nerve_Tibial = 'Nerve_Tibial',
  Ovary = 'Ovary',
  Pancreas = 'Pancreas',
  Pituitary = 'Pituitary',
  Prostate = 'Prostate',
  Skin_Not_Sun_Exposed_Suprapubic = 'Skin_Not_Sun_Exposed_Suprapubic',
  Skin_Sun_Exposed_Lower_leg = 'Skin_Sun_Exposed_Lower_leg',
  Small_Intestine_Terminal_Ileum = 'Small_Intestine_Terminal_Ileum',
  Spleen = 'Spleen',
  Stomach = 'Stomach',
  Testis = 'Testis',
  Thyroid = 'Thyroid',
  Uterus = 'Uterus',
  Vagina = 'Vagina',
  Whole_Blood = 'Whole_Blood',
}

//Interface that describe the properties that are required to create a new job
interface SpgwasAttrs {
  job: string;
  useTest: string;
  marker_name: string;
  chr: string;
  position: string;
  effect_allele: string;
  alternate_allele: string;
  maf: string;
  beta: string;
  standard_error: string;
  pvalue: string;
  sample_size: string;
  population: Populations;
  clump_p1: string;
  clump_p2: string;
  clump_r2: string;
  clump_kb: string;
  clump_allow_overlap: YesNoOptions;
  clump_use_gene_region_file: YesNoOptions;
  clump_range: GeneListOptions;
  clump_range_border: string;
  coloc_type: string;
  coloc_s: string;
  coloc_p1: string;
  pascal_runpathway: OnOffOptions;
  pascal_chr: ChromosomesAll;
  pascal_genesetfile: string;
  pascal_pvalue_cutoff: string;
  pascal_up: string;
  pascal_down: string;
  pascal_maxsnp: string;
  pascal_genescoring: GeneScoring;
  pascal_mergedistance: string;
  pascal_mafcutoff: string;
  emagma_synonym: SynonymousSNPS;
  emagma_up_window: string;
  emagma_down_window: string;
  emagma_tissues: TISSUEOptions;
  smr_heidi: OnOffOptions;
  smr_trans: OnOffOptions;
  smr_smr_multi: OnOffOptions;
  smr_maf: string;
  smr_diff_freq: string;
  smr_diff_freq_prop: string;
  smr_cis_wind: string;
  smr_peqtl_smr: string;
  smr_ld_upper_limit: string;
  smr_ld_lower_limit: string;
  smr_peqtl_heidi: string;
  smr_heidi_mtd: string;
  smr_heidi_min_m: string;
  smr_heidi_max_m: string;
  smr_trans_wind: string;
  smr_set_wind: string;
  smr_ld_multi_snp: string;
  smr_westra_eqtl: TrueFalseOptions;
  smr_cage_eqtl: TrueFalseOptions;
  smr_gtex_tissue: TISSUEOptions;
  annot_gene_db: GeneDB;
  annot_cytoband: TrueFalseOptions;
  annot_all: TrueFalseOptions;
  annot_afr: TrueFalseOptions;
  annot_amr: TrueFalseOptions;
  annot_eas: TrueFalseOptions;
  annot_eur: TrueFalseOptions;
  annot_sas: TrueFalseOptions;
  annot_exac: TrueFalseOptions;
  annot_disgenet: TrueFalseOptions;
  annot_clinvar: TrueFalseOptions;
  annot_intervar: TrueFalseOptions;
  haplor_ld_threshold: string;
  haplor_epi: EPITypes;
  haplor_cons: CONSTypes;
  haplor_genetypes: Genetypes;
}

// An interface that describes the extra properties that a eqtl model has
//collection level methods
interface SpgwasModel extends mongoose.Model<SpgwasDoc> {
  build(attrs: SpgwasAttrs): SpgwasDoc;
}

//An interface that describes a properties that a document has
export interface SpgwasDoc extends mongoose.Document {
  id: string;
  version: number;
  useTest: boolean;
  marker_name: number;
  chr: number;
  position: number;
  effect_allele: number;
  alternate_allele: number;
  maf: number;
  beta: number;
  standard_error: number;
  pvalue: number;
  sample_size: number;
  population: Populations;
  clump_p1: number;
  clump_p2: number;
  clump_r2: number;
  clump_kb: number;
  clump_allow_overlap: YesNoOptions;
  clump_use_gene_region_file: YesNoOptions;
  clump_range: GeneListOptions;
  clump_range_border: number;
  coloc_type: ColocTypeOptions;
  coloc_s: number;
  coloc_p1: number;
  pascal_runpathway: OnOffOptions;
  pascal_chr: ChromosomesAll;
  pascal_genesetfile: string;
  pascal_pvalue_cutoff: number;
  pascal_up: number;
  pascal_down: number;
  pascal_maxsnp: number;
  pascal_genescoring: GeneScoring;
  pascal_mergedistance: number;
  pascal_mafcutoff: number;
  emagma_synonym: SynonymousSNPS;
  emagma_up_window: number;
  emagma_down_window: number;
  emagma_tissues: TISSUEOptions;
  smr_heidi: OnOffOptions;
  smr_trans: OnOffOptions;
  smr_smr_multi: OnOffOptions;
  smr_maf: number;
  smr_diff_freq: number;
  smr_diff_freq_prop: number;
  smr_cis_wind: number;
  smr_peqtl_smr: number;
  smr_ld_upper_limit: number;
  smr_ld_lower_limit: number;
  smr_peqtl_heidi: number;
  smr_heidi_mtd: number;
  smr_heidi_min_m: number;
  smr_heidi_max_m: number;
  smr_trans_wind: number;
  smr_set_wind: number;
  smr_ld_multi_snp: number;
  smr_westra_eqtl: TrueFalseOptions;
  smr_cage_eqtl: TrueFalseOptions;
  smr_gtex_tissue: TISSUEOptions;
  annot_gene_db: GeneDB;
  annot_cytoband: TrueFalseOptions;
  annot_all: TrueFalseOptions;
  annot_afr: TrueFalseOptions;
  annot_amr: TrueFalseOptions;
  annot_eas: TrueFalseOptions;
  annot_eur: TrueFalseOptions;
  annot_sas: TrueFalseOptions;
  annot_exac: TrueFalseOptions;
  annot_disgenet: TrueFalseOptions;
  annot_clinvar: TrueFalseOptions;
  annot_intervar: TrueFalseOptions;
  haplor_ld_threshold: number;
  haplor_epi: EPITypes;
  haplor_cons: CONSTypes;
  haplor_genetypes: Genetypes;
}

const SpgwasSchema = new mongoose.Schema<SpgwasDoc, SpgwasModel>(
  {
    useTest: {
      type: Boolean,
      trim: true,
    },
    marker_name: {
      type: Number,
      trim: true,
    },
    chr: {
      type: Number,
      trim: true,
    },
    position: {
      type: Number,
      trim: true,
    },
    effect_allele: {
      type: Number,
      trim: true,
    },
    alternate_allele: {
      type: Number,
      trim: true,
    },
    maf: {
      type: Number,
      trim: true,
    },
    beta: {
      type: Number,
      trim: true,
    },
    standard_error: {
      type: Number,
      trim: true,
    },
    pvalue: {
      type: Number,
      trim: true,
    },
    sample_size: {
      type: Number,
      trim: true,
    },
    population: {
      type: String,
      enum: [
        Populations.AFR,
        Populations.AMR,
        Populations.EUR,
        Populations.EAS,
        Populations.SAS,
      ],
      trim: true,
    },
    clump_p1: {
      type: Number,
      trim: true,
    },
    clump_p2: {
      type: Number,
      trim: true,
    },
    clump_r2: {
      type: Number,
      trim: true,
    },
    clump_kb: {
      type: Number,
      trim: true,
    },
    clump_allow_overlap: {
      type: String,
      enum: [YesNoOptions.YES, YesNoOptions.NO],
      trim: true,
    },
    clump_use_gene_region_file: {
      type: String,
      enum: [YesNoOptions.YES, YesNoOptions.NO],
      trim: true,
    },
    clump_range: {
      type: String,
      enum: [GeneListOptions.GLISTHG19, GeneListOptions.GLISTHG38],
      trim: true,
    },
    clump_range_border: {
      type: Number,
      trim: true,
    },
    coloc_type: {
      type: String,
      enum: [ColocTypeOptions.QUANTIFICATION, ColocTypeOptions.CASECONTROL],
    },
    coloc_s: {
      type: Number,
      trim: true,
    },
    coloc_p1: {
      type: Number,
      trim: true,
    },
    pascal_runpathway: {
      type: String,
      enum: [OnOffOptions.ON, OnOffOptions.OFF],
      trim: true,
    },
    pascal_chr: {
      type: String,
      enum: [...Object.values(ChromosomesAll)],
      trim: true,
    },
    pascal_genesetfile: {
      type: String,
      trim: true,
    },
    pascal_pvalue_cutoff: {
      type: Number,
      trim: true,
    },
    pascal_up: {
      type: Number,
      trim: true,
    },
    pascal_down: {
      type: Number,
      trim: true,
    },
    pascal_maxsnp: {
      type: Number,
      trim: true,
    },
    pascal_genescoring: {
      type: String,
      enum: [GeneScoring.MAX, GeneScoring.SUM],
      trim: true,
    },
    pascal_mergedistance: {
      type: Number,
      trim: true,
    },
    pascal_mafcutoff: {
      type: Number,
      trim: true,
    },
    emagma_synonym: {
      type: String,
      enum: [
        SynonymousSNPS.NO,
        SynonymousSNPS.DROP,
        SynonymousSNPS.DROP_DUP,
        SynonymousSNPS.SKIP,
        SynonymousSNPS.SKIP_DUP,
      ],
      trim: true,
    },
    emagma_up_window: {
      type: Number,
      trim: true,
    },
    emagma_down_window: {
      type: Number,
      trim: true,
    },
    emagma_tissues: {
      type: String,
      enum: [...Object.values(TISSUEOptions)],
      trim: true,
    },
    smr_heidi: {
      type: String,
      enum: [OnOffOptions.OFF, OnOffOptions.ON],
      trim: true,
    },
    smr_trans: {
      type: String,
      enum: [OnOffOptions.OFF, OnOffOptions.ON],
      trim: true,
    },
    smr_smr_multi: {
      type: String,
      enum: [OnOffOptions.ON, OnOffOptions.OFF],
      trim: true,
      default: OnOffOptions.OFF,
    },
    smr_maf: {
      type: Number,
      trim: true,
      default: 0.05,
    },
    smr_diff_freq: {
      type: Number,
      trim: true,
      default: 0.2,
    },
    smr_diff_freq_prop: {
      type: Number,
      trim: true,
      default: 0.05,
    },
    smr_cis_wind: {
      type: Number,
      trim: true,
      default: 2000,
    },
    smr_peqtl_smr: {
      type: Number,
      trim: true,
      default: 5.0e-8,
    },
    smr_ld_upper_limit: {
      type: Number,
      trim: true,
      default: 0.9,
    },
    smr_ld_lower_limit: {
      type: Number,
      trim: true,
      default: 0.05,
    },
    smr_peqtl_heidi: {
      type: Number,
      trim: true,
      default: 1.57e-3,
    },
    smr_heidi_mtd: {
      type: Number,
      trim: true,
      default: 1,
    },
    smr_heidi_min_m: {
      type: Number,
      trim: true,
      default: 3,
    },
    smr_heidi_max_m: {
      type: Number,
      trim: true,
      default: 20,
    },
    smr_trans_wind: {
      type: Number,
      trim: true,
      default: 1000,
    },
    smr_set_wind: {
      type: Number,
      trim: true,
      default: -9,
    },
    smr_ld_multi_snp: {
      type: Number,
      trim: true,
      default: 0.1,
    },
    smr_westra_eqtl: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    smr_cage_eqtl: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    smr_gtex_tissue: {
      type: String,
      enum: [...Object.values(TISSUEOptions)],
      trim: true,
    },
    annot_gene_db: {
      type: String,
      enum: [GeneDB.REFSEQ, GeneDB.ENSEMBL, GeneDB.UCSC],
      trim: true,
      default: GeneDB.REFSEQ,
    },
    annot_cytoband: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_all: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_afr: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_amr: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_eas: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_eur: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_sas: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_exac: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_disgenet: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_clinvar: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    annot_intervar: {
      type: String,
      enum: [TrueFalseOptions.TRUE, TrueFalseOptions.FALSE],
      trim: true,
      default: TrueFalseOptions.FALSE,
    },
    haplor_ld_threshold: {
      type: Number,
      trim: true,
    },
    haplor_epi: {
      type: String,
      enum: [EPITypes.VANILLA, EPITypes.METHYL, EPITypes.IMPUTED],
      trim: true,
      default: EPITypes.VANILLA,
    },
    haplor_cons: {
      type: String,
      enum: [CONSTypes.GERP, CONSTypes.SIPHY, CONSTypes.BOTH],
      trim: true,
      default: CONSTypes.BOTH,
    },
    haplor_genetypes: {
      type: String,
      enum: [Genetypes.GENCODE, Genetypes.REFSEQ],
      trim: true,
      default: Genetypes.REFSEQ,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SpgwasJob',
      required: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
SpgwasSchema.set('versionKey', 'version');

//collection level methods
SpgwasSchema.statics.build = (attrs: SpgwasAttrs) => {
  return new SpgwasModel(attrs);
};

//create mongoose model
const SpgwasModel = mongoose.model<SpgwasDoc, SpgwasModel>(
  'Spgwas',
  SpgwasSchema,
  'spgwas',
);

export { SpgwasModel };
