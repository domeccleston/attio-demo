import pandas as pd
import random
from typing import List, Dict

# Define possible UTM values
UTM_VALUES = {
    'source': [
        'google',
        'linkedin',
        'producthunt',
        'techcrunch',
        'twitter',
        'reddit',
        'ycombinator',
        'saaster',
        'blog',
        'podcast'
    ],
    'medium': [
        'cpc',
        'social',
        'organic',
        'referral',
        'email',
        'content',
        'community'
    ],
    'campaign': [
        'launch',
        'competitor_alternative',
        'crm_guide',
        'startup_tools',
        'product_demo',
        'migration_guide',
        'summer_promo',
        'series_a'
    ],
    'content': [
        'demo_video',
        'comparison_table',
        'case_study',
        'webinar',
        'ebook',
        'infographic',
        'founder_story'
    ],
    'term': [
        'crm_alternative',
        'sales_workspace',
        'deal_tracking',
        'startup_crm',
        'attio_vs',
        'modern_crm',
        'workspace_tools'
    ]
}

def enrich_with_utms(df: pd.DataFrame) -> pd.DataFrame:
    """
    Enrich dataframe with UTM parameters using predefined value lists.
    
    Args:
        df: Input DataFrame
        
    Returns:
        DataFrame with added UTM columns
    """
    # Create a copy to avoid modifying the original
    enriched_df = df.copy()
    
    # Add UTM columns
    for param, values in UTM_VALUES.items():
        column_name = f'utm_{param}'
        enriched_df[column_name] = [random.choice(values) for _ in range(len(df))]
    
    return enriched_df

def main(input_path: str, output_path: str):
    """
    Read CSV, enrich with UTMs, and save to new file.
    
    Args:
        input_path: Path to input CSV
        output_path: Path to save enriched CSV
    """
    # Read input CSV
    df = pd.read_csv(input_path)
    
    # Enrich with UTMs
    enriched_df = enrich_with_utms(df)
    
    # Save to new CSV
    enriched_df.to_csv(output_path, index=False)
    print(f"Enriched data saved to {output_path}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python script.py input.csv output.csv")
        sys.exit(1)
        
    main(sys.argv[1], sys.argv[2])