import urllib.request
import json

url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BGD.geo.json"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode('utf-8'))
        
    geometry = data.get("geometry")
    if not geometry:
        geometry = data["features"][0]["geometry"]
        
    coords = geometry["coordinates"]
    if geometry["type"] == "Polygon":
        coords = [coords]
        
    # Get all points
    points = []
    for poly in coords:
        for ring in poly:
            for pt in ring:
                points.append(pt)
                
    # Find bounding box
    min_lon = min(p[0] for p in points)
    max_lon = max(p[0] for p in points)
    min_lat = min(p[1] for p in points)
    max_lat = max(p[1] for p in points)
    
    width = max_lon - min_lon
    height = max_lat - min_lat
    
    svg_width = 300
    svg_height = 400
    offset_x = 100
    offset_y = 50
    
    scale_x = svg_width / width
    scale_y = svg_height / height
    scale = min(scale_x, scale_y)
    
    path_data = []
    
    for poly in coords:
        for ring in poly:
            for i, pt in enumerate(ring):
                lon, lat = pt[0], pt[1]
                x = offset_x + (lon - min_lon) * scale
                y = offset_y + (max_lat - lat) * scale
                
                cmd = "M" if i == 0 else "L"
                path_data.append(f"{cmd}{x:.1f},{y:.1f}")
            path_data.append("Z")
            
    print(" ".join(path_data))
    
    dhaka_lon, dhaka_lat = 90.4125, 23.8103
    dhaka_x = offset_x + (dhaka_lon - min_lon) * scale
    dhaka_y = offset_y + (max_lat - dhaka_lat) * scale
    print(f"\nDhaka Position:\ncx='{dhaka_x:.1f}' cy='{dhaka_y:.1f}'")
    
except Exception as e:
    print(e)
