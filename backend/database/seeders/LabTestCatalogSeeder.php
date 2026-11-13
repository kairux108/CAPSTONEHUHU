<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LabTestCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            'Hematology' => [
                'Complete Blood Count (CBC)',
                'Hemoglobin',
                'Hematocrit',
                'Platelet Count',
                'Peripheral Blood Smear',
                'Erythrocyte Sedimentation Rate (ESR)',
                'Prothrombin Time (PT/INR)',
                'Activated Partial Thromboplastin Time (aPTT)',
                'Blood Typing and Rh Factor',
            ],

            'Blood Chemistry' => [
                'Fasting Blood Sugar (FBS)',
                'Random Blood Sugar (RBS)',
                'HbA1c',
                'Oral Glucose Tolerance Test (OGTT)',
                'Lipid Profile',
                'Total Cholesterol',
                'Triglycerides',
                'HDL Cholesterol',
                'LDL Cholesterol',
                'Creatinine',
                'Blood Urea Nitrogen (BUN)',
                'Uric Acid',
                'ALT / SGPT',
                'AST / SGOT',
                'Alkaline Phosphatase (ALP)',
                'Bilirubin',
                'Albumin',
                'Sodium',
                'Potassium',
                'Chloride',
                'Calcium',
            ],

            'Urine and Stool' => [
                'Routine Urinalysis',
                'Urine Culture and Sensitivity',
                'Urine Pregnancy Test',
                'Urine Protein',
                'Urine Albumin-to-Creatinine Ratio',
                'Stool Examination',
                'Fecal Occult Blood Test',
                'Stool Culture',
            ],

            'Serology and Immunology' => [
                'Dengue NS1 Antigen',
                'Dengue IgM / IgG',
                'HBsAg',
                'Anti-HBs',
                'HIV Screening',
                'Syphilis Screening',
                'C-Reactive Protein (CRP)',
                'Rheumatoid Factor',
                'Antinuclear Antibody (ANA)',
            ],

            'Microbiology' => [
                'Blood Culture and Sensitivity',
                'Sputum Culture and Sensitivity',
                'Gram Stain',
                'Acid-Fast Bacilli (AFB) Smear',
                'TB Molecular Test',
                'Wound Culture and Sensitivity',
            ],

            'Thyroid and Hormones' => [
                'Thyroid Stimulating Hormone (TSH)',
                'Free T3',
                'Free T4',
                'Beta-hCG (Serum)',
                'Prolactin',
            ],

            'Imaging and Diagnostics' => [
                'Chest X-ray',
                'Abdominal X-ray',
                'Abdominal Ultrasound',
                'Pelvic Ultrasound',
                'Thyroid Ultrasound',
                '12-lead ECG',
                'Echocardiogram',
                'CT Scan',
                'MRI',
            ],
        ];

        $now = now();
        $rows = [];

        foreach ($catalog as $category => $tests) {
            foreach ($tests as $index => $name) {
                $rows[] = [
                    'category' => $category,
                    'name' => $name,
                    'is_active' => true,
                    'sort_order' => $index + 1,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        // Avoid duplicate entries when seeding again.
        // Existing clinic settings are left unchanged.
        DB::table('lab_test_catalog')->insertOrIgnore($rows);
    }
}
