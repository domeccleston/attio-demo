import pandas as pd
import numpy as np
from datetime import datetime

def add_modelflow_usage_data(input_csv, output_csv):
    """
    Takes an input CSV of ModelFlow workspaces and adds realistic usage data.
    
    Parameters:
    input_csv (str): Path to the input CSV file
    output_csv (str): Path to save the enriched CSV file
    """
    # Read the original CSV
    df = pd.read_csv(input_csv)
    
    # Convert signup date to datetime and ensure it's timezone-naive
    df['Signup date'] = pd.to_datetime(df['Signup date']).dt.tz_localize(None)
    
    # Calculate months since signup for activity scaling
    today = datetime.now().replace(tzinfo=None)  # Make timezone-naive
    df['Months active'] = ((today - df['Signup date']).dt.days / 30).fillna(1).round().astype(int)
    df['Months active'] = df['Months active'].clip(lower=1)  # Ensure at least 1 month
    
    # Set seed for reproducibility
    np.random.seed(42)
    
    # Generate usage data
    usage_data = []
    for _, row in df.iterrows():
        # Handle plan tiers
        if row['Plan'] == 'Free':
            api_calls_base = 5000
            compute_hours_base = 5
            storage_gb_base = 2
            model_size_range = (0.1, 1.5)
            latency_range = (100, 500)
            max_models = 2
            cost_per_seat = 0
        elif row['Plan'] == 'Pro':
            api_calls_base = 50000
            compute_hours_base = 40
            storage_gb_base = 20
            model_size_range = (0.5, 5)
            latency_range = (50, 200)
            max_models = 10
            cost_per_seat = 25
        elif row['Plan'] == 'Enterprise':
            api_calls_base = 200000
            compute_hours_base = 200
            storage_gb_base = 100
            model_size_range = (1, 20)
            latency_range = (20, 100)
            max_models = 50
            cost_per_seat = 100
        else:
            # Default to Free for empty plans
            api_calls_base = 5000
            compute_hours_base = 5
            storage_gb_base = 2
            model_size_range = (0.1, 1.5)
            latency_range = (100, 500)
            max_models = 2
            cost_per_seat = 0
        
        # Scale by number of seats
        seats = int(row['Seats']) if pd.notna(row['Seats']) and row['Seats'] != '' else 1
        seat_factor = np.sqrt(seats)  # Square root scaling for realistic team usage
        
        # Scale by account age (newer accounts use less)
        months_active = row['Months active']
        growth_factor = min(1.0, 0.3 + (months_active / 12) * 0.7)
        
        # Add randomness to make data realistic
        variation = 0.3  # 30% variation
        random_factor = 1 + (np.random.random() - 0.5) * 2 * variation
        
        # Calculate metrics
        monthly_api_calls = int(api_calls_base * seat_factor * growth_factor * random_factor)
        monthly_api_calls = max(100, monthly_api_calls)  # Minimum 100 calls
        
        # Compute hours based on API calls
        compute_factor = np.random.uniform(0.8, 1.2)
        compute_hours = round(compute_hours_base * seat_factor * growth_factor * compute_factor, 1)
        
        # Storage scales with seats and activity
        storage_factor = np.random.uniform(0.7, 1.3)
        data_storage = round(storage_gb_base * seat_factor * growth_factor * storage_factor, 1)
        
        # Model size varies by plan tier with some randomness
        model_size = round(np.random.uniform(model_size_range[0], model_size_range[1]), 2)
        
        # Number of deployed models
        model_count_factor = np.random.uniform(0.5, 1.0)
        deployed_models = min(
            max(1, int(max_models * seat_factor * growth_factor * model_count_factor * 0.3)),
            max_models
        )
        
        # Latency
        latency = round(np.random.uniform(latency_range[0], latency_range[1]), 0)
        
        # Cost calculation
        base_cost = cost_per_seat * seats
        compute_cost = compute_hours * 0.10  # $0.10 per compute hour
        storage_cost = data_storage * 0.05   # $0.05 per GB storage
        monthly_cost = round(base_cost + compute_cost + storage_cost, 2)
        
        # Create usage record
        usage = {
            'Monthly API calls': monthly_api_calls,
            'Compute hours': compute_hours,
            'Data storage (GB)': data_storage,
            'Average model size (GB)': model_size,
            'Deployed models': deployed_models,
            'Average latency (ms)': latency,
            'Monthly cost ($)': monthly_cost
        }
        usage_data.append(usage)
    
    # Add usage data to the original dataframe
    usage_df = pd.DataFrame(usage_data)
    result_df = pd.concat([df, usage_df], axis=1)
    
    # Remove the temporary 'Months active' column
    result_df = result_df.drop('Months active', axis=1)
    
    # Save the enriched data
    result_df.to_csv(output_csv, index=False)
    print(f"Enriched data saved to {output_csv}")

if __name__ == "__main__":
    input_file = "workspaces2.csv"
    output_file = "workspaces3.csv"
    add_modelflow_usage_data(input_file, output_file)