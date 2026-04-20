import os
import re

target_dir = r"c:\Users\Acer\Desktop\Foodwaste\client\foodwaste\src"

replacements = {
    # Backgrounds and Borders
    r"from-\[\#F8F6F2\]": "from-slate-50",
    r"to-\[\#FAFAFA\]": "to-slate-100",
    r"bg-\[\#F8F6F2\]": "bg-slate-50",
    r"bg-\[\#FAFAFA\]": "bg-white",
    r"border-\[\#EDE6DB\]": "border-slate-200",
    r"bg-\[\#EDE6DB\]": "bg-slate-200",
    r"divide-\[\#EDE6DB\]": "divide-slate-200",
    
    # Dark mode backgrounds (fixing the white/gray-800 to slate-900/slate-800)
    r"dark:bg-gray-900": "dark:bg-slate-900",
    r"dark:from-gray-900": "dark:from-slate-900",
    r"dark:bg-gray-800": "dark:bg-slate-800",
    r"dark:to-gray-800": "dark:to-slate-800",
    r"dark:bg-gray-700": "dark:bg-slate-700/50",
    r"dark:border-gray-700": "dark:border-slate-700",
    r"dark:border-gray-600": "dark:border-slate-600",
    r"dark:divide-gray-700": "dark:divide-slate-700",
    
    # Primary Greens -> Emeralds
    r"bg-\[\#2F5D50\]": "bg-emerald-700",
    r"text-\[\#2F5D50\]": "text-emerald-700",
    r"border-\[\#2F5D50\]": "border-emerald-700",
    r"from-\[\#2F5D50\]": "from-emerald-700",
    r"to-\[\#2F5D50\]": "to-emerald-700",
    
    r"bg-\[\#7BAE7F\]": "bg-emerald-500",
    r"text-\[\#7BAE7F\]": "text-emerald-500",
    r"border-\[\#7BAE7F\]": "border-emerald-500",
    r"from-\[\#7BAE7F\]": "from-emerald-500",
    r"to-\[\#7BAE7F\]": "to-emerald-500",
    
    r"bg-\[\#1F4D40\]": "bg-emerald-800",
    r"hover:bg-\[\#1F4D40\]": "hover:bg-emerald-800",
    
    # Grays -> Slates
    r"text-\[\#1F2937\]": "text-slate-900",
    r"text-\[\#4B5563\]": "text-slate-600",
    r"dark:text-gray-400": "dark:text-slate-400",
    r"dark:text-gray-500": "dark:text-slate-500",
    
    # Specific edge cases
    r"bg-\[\#2F5D50\]/10": "bg-emerald-700/10",
    r"bg-\[\#7BAE7F\]/10": "bg-emerald-500/10",
    r"bg-\[\#7BAE7F\]/20": "bg-emerald-500/20",
    r"hover:bg-\[\#7BAE7F\]/20": "hover:bg-emerald-500/20",
    r"text-\[\#7BAE7F\]": "text-emerald-500",
}

for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".css"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
                
            original_content = content
            for pattern, rep in replacements.items():
                content = re.sub(pattern, rep, content)
                
            if content != original_content:
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Updated {file}")

print("Color migration complete.")
