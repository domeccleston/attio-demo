import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import uuid
import csv

def generate_dummy_deals(num_records=50):
    # Real companies and their workspace mappings from your data
    company_workspaces = {
        "Glow Communications": ["Glow AI", "Glow Solutions", "Glow"],
        "Volt": ["Volt Solutions", "Volt"],
        "Nova - Community Association Management": ["Nova Solutions", "Nova AI", "Nova Works"],
        "Keen.com": ["Keen", "Keen Data", "Keen Works"],
        "IRIS Centre": ["Iris Studio", "Iris"],
        "Quest Software": ["Quest"],
        "Bolt": ["Bolt", "Bolt Solutions", "Bolt Data", "Bolt AI"],
        "WAVE": ["Wave Labs", "Wave Data", "Wave Software", "Wave"],
        "Pulse 2.0": ["Pulse Data"],
        "Accel": ["Accel", "Accel Studio"],
        "Riot Comedy Club": ["Riot Systems", "Riot Tech", "Riot"],
        "Helix": ["Helix Software", "Helix", "Helix Works", "Helix Labs"],
        "Journey": ["Jolt Data"],
        "7Sage": ["Sage", "Sage Data"],
        "Fashion Nova": ["Nova Data"],
        "Grupo Cosmic": ["Cosmic", "Cosmic Systems"],
        "Orbit": ["Orbit", "Orbit Labs", "Orbit Works", "Orbit Software"],
        "Terra": ["Terra", "Terra Works"],
        "Iris": ["Iris Software", "Iris Solutions", "Iris Tech"],
        "Yield Communications": ["Yield Tech", "Yield"],
        "ZOOM.COM.NG": ["Zoom"],
        "Salesloft": ["Drift", "Drift Software", "Drift Systems"],
        "LUNAR": ["Lunar Data", "Lunar"],
        "Attio": ["Unnamed Workspace"],
        "Sanan Media": ["Xenon Labs", "Xenon"],
        "Mist": ["Mist Studio", "Mist Systems"],
        "Jolt Software": ["Jolt Systems", "Jolt"],
        "9flux": ["Flux Tech", "Flux"],
        "Echo Global Logistics": ["Echo AI", "Echo Works", "Echo"],
        "Lullwater & Co": ["Lunar Tech"],
        "Unity Communications": ["Unity Systems"],
        "Pulse": ["Pulse", "Pulse Labs"],
        "Wave Mobile Money": ["Wave AI"],
        "AdMedia": ["Yield Design"],
        "Unity": ["Unity Labs"]
    }
    
    # Real deal owners from your system
    owners = [
        ("Dom Eccleston", "dom@attio.com")
    ]
    
    # Deal stages from your actual data
    deal_stages = ["Lead", "Qualified", "Meeting Scheduled", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]
    
    # Generate base data
    data = []
    current_date = datetime.now()
    
    # Create mapping of workspace names to IDs
    workspace_id_map = {}
    with open('data/workspaces.csv', 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            workspace_id_map[row['name']] = row['workspace_id']
    
    for i in range(num_records):
        # Generate a random date within the last 90 days
        random_days = random.randint(0, 90)
        date = (current_date - timedelta(days=random_days)).strftime("%Y-%m-%dT%H:%M:%SZ")
        
        # Select random company and its workspaces
        company = random.choice(list(company_workspaces.keys()))
        workspace = random.choice(company_workspaces[company])
        
        # For Associated company > Associated workspaces, sometimes include multiple workspaces
        available_workspaces = len(company_workspaces[company])
        if random.random() < 0.3 and available_workspaces > 1:
            num_workspaces = random.randint(2, available_workspaces)
            selected_workspaces = random.sample(company_workspaces[company], num_workspaces)
            associated_workspaces = ",".join(workspace_id_map[ws] for ws in selected_workspaces)
        else:
            associated_workspaces = workspace_id_map[workspace]
        
        # Select owner
        owner, email = owners[0]  # Currently only one owner in system
        
        # Generate random deal value (leave empty 30% of the time to match your pattern)
        deal_value = "" if random.random() < 0.3 else round(random.uniform(5000, 100000), 2)
        
        # Generate random number of seats (leave empty 30% of the time to match your pattern)
        seats = "" if random.random() < 0.3 else random.randint(5, 200)
        
        # Generate record ID as UUID
        record_id = str(uuid.uuid4())
        
        # Select random stage and generate previous stages
        current_stage = random.choice(deal_stages)
        stage_index = deal_stages.index(current_stage)
        previous_stages = ", ".join(deal_stages[:stage_index]) if stage_index > 0 else ""
        
        # Generate record name following your convention
        record = f"{company} – inbound"
        
        # Use actual associated people pattern
        associated_people = "Dominic Eccleston"
        
        deal_record = {
            "Record ID": record_id,
            "Record": record,
            "Associated company > Associated workspaces": associated_workspaces,
            "Associated people": associated_people,
            "Deal stage": current_stage,
            "Deal stage Changed At": date,
            "Deal stage Previous Values": previous_stages,
            "Deal value": deal_value,
            "Workspace": workspace,
            "Deal owner": owner,
            "Deal owner email": email,
            "Seats": seats
        }
        
        data.append(deal_record)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Save to CSV
    output_filename = "dummy_deals.csv"
    df.to_csv(output_filename, index=False)
    print(f"Generated {len(df)} dummy deal records and saved to {output_filename}")
    
    return df

# Generate 50 dummy records
if __name__ == "__main__":
    dummy_deals = generate_dummy_deals(50)
    print("\nSample of the generated data:")
    print(dummy_deals.head())