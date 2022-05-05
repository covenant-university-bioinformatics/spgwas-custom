import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import {
  ChromosomesAll,
  ColocTypeOptions,
  CONSTypes,
  EPITypes,
  GeneDB,
  GeneListOptions,
  GeneScoring,
  Genetypes,
  OnOffOptions,
  Populations,
  SynonymousSNPS,
  TISSUEOptions,
  TrueFalseOptions,
  YesNoOptions,
} from '../models/spgwas.model';

export class CreateJobDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  job_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBooleanString()
  useTest: string;

  @IsNumberString()
  marker_name: string;

  @IsNumberString()
  chr: string;

  @IsNumberString()
  position: string;

  @IsNumberString()
  effect_allele: string;

  @IsNumberString()
  alternate_allele: string;

  @IsNumberString()
  maf: string;

  @IsNumberString()
  beta: string;

  @IsNumberString()
  standard_error: string;

  @IsNumberString()
  pvalue: string;

  @IsNumberString()
  sample_size: string;

  @IsNotEmpty()
  @IsEnum(Populations)
  population: Populations;

  @IsNumberString()
  clump_p1: string;

  @IsNumberString()
  clump_p2: string;

  @IsNumberString()
  clump_r2: string;

  @IsNumberString()
  clump_kb: string;

  @IsNotEmpty()
  @IsEnum(YesNoOptions)
  clump_allow_overlap: YesNoOptions;

  @IsNotEmpty()
  @IsEnum(YesNoOptions)
  clump_use_gene_region_file: YesNoOptions;

  @IsNotEmpty()
  @IsEnum(GeneListOptions)
  clump_range: GeneListOptions;

  @IsNumberString()
  clump_range_border: string;

  @IsNotEmpty()
  @IsEnum(ColocTypeOptions)
  coloc_type: ColocTypeOptions;

  @IsNumberString()
  coloc_s: string;

  @IsNumberString()
  coloc_p1: string;

  @IsNotEmpty()
  @IsEnum(OnOffOptions)
  pascal_runpathway: OnOffOptions;

  @IsNotEmpty()
  @IsEnum(ChromosomesAll)
  pascal_chr: ChromosomesAll;

  @IsString()
  pascal_genesetfile: string;

  @IsNumberString()
  pascal_pvalue_cutoff: string;

  @IsNumberString()
  pascal_up: string;

  @IsNumberString()
  pascal_down: string;

  @IsNumberString()
  pascal_maxsnp: string;

  @IsNotEmpty()
  @IsEnum(GeneScoring)
  pascal_genescoring: GeneScoring;

  @IsNumberString()
  pascal_mergedistance: string;

  @IsNumberString()
  pascal_mafcutoff: string;

  @IsNotEmpty()
  @IsEnum(SynonymousSNPS)
  emagma_synonym: SynonymousSNPS;

  @IsNumberString()
  emagma_up_window: string;

  @IsNumberString()
  emagma_down_window: string;

  @IsNotEmpty()
  @IsEnum(TISSUEOptions)
  emagma_tissues: TISSUEOptions;

  @IsNotEmpty()
  @IsEnum(OnOffOptions)
  smr_heidi: OnOffOptions;

  @IsNotEmpty()
  @IsEnum(OnOffOptions)
  smr_trans: OnOffOptions;

  @IsNotEmpty()
  @IsEnum(OnOffOptions)
  smr_smr_multi: OnOffOptions;

  @IsNumberString()
  smr_maf: string;

  @IsNumberString()
  smr_diff_freq: string;

  @IsNumberString()
  smr_diff_freq_prop: string;

  @IsNumberString()
  smr_cis_wind: string;

  @IsNumberString()
  smr_peqtl_smr: string;

  @IsNumberString()
  smr_ld_upper_limit: string;

  @IsNumberString()
  smr_ld_lower_limit: string;

  @IsNumberString()
  smr_peqtl_heidi: string;

  @IsNumberString()
  smr_heidi_mtd: string;

  @IsNumberString()
  smr_heidi_min_m: string;

  @IsNumberString()
  smr_heidi_max_m: string;

  @IsNumberString()
  smr_trans_wind: string;

  @IsNumberString()
  smr_set_wind: string;

  @IsNumberString()
  smr_ld_multi_snp: string;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  smr_westra_eqtl: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  smr_cage_eqtl: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TISSUEOptions)
  smr_gtex_tissue: TISSUEOptions;

  @IsNotEmpty()
  @IsEnum(GeneDB)
  annot_gene_db: GeneDB;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_cytoband: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_all: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_afr: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_amr: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_eas: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_eur: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_sas: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_exac: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_disgenet: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_clinvar: TrueFalseOptions;

  @IsNotEmpty()
  @IsEnum(TrueFalseOptions)
  annot_intervar: TrueFalseOptions;

  @IsNumberString()
  haplor_ld_threshold: string;

  @IsNotEmpty()
  @IsEnum(EPITypes)
  haplor_epi: EPITypes;

  @IsNotEmpty()
  @IsEnum(CONSTypes)
  haplor_cons: CONSTypes;

  @IsNotEmpty()
  @IsEnum(Genetypes)
  haplor_genetypes: Genetypes;
}
