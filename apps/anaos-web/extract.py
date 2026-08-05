import sys

with open("src/app/dashboard/page.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

def extract_between(start_str, output_file):
    start_idx = -1
    end_idx = -1
    for i, line in enumerate(lines):
        if line.startswith(start_str):
            start_idx = i
            break
    if start_idx != -1:
        brace_count = 0
        for i in range(start_idx, len(lines)):
            brace_count += lines[i].count("{")
            brace_count -= lines[i].count("}")
            if brace_count == 0 and lines[i].strip() == "}":
                end_idx = i
                break
    
    if start_idx != -1 and end_idx != -1:
        extracted = "".join(lines[start_idx:end_idx+1])
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(extracted)
        print(f"Extracted to {output_file}")
        return True
    return False

extract_between("function Sidebar(", "src/components/dashboard/SidebarOriginal.tsx")
extract_between("function Topbar(", "src/components/dashboard/TopbarOriginal.tsx")
extract_between("function DashboardHome(", "src/components/dashboard/DashboardHomeOriginal.tsx")
