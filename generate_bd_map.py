import urllib.request
import json

url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BGD.geo.json"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode('utf-8'))
        
    # The geometry could be Polygon or MultiPolygon.
    features = data.get("features", [data])
    geometry = data.get("geometry", features[0].get("geometry", {}))
    
    coords = geometry["coordinates"]
    if geometry["type"] == "Polygon":
        coords = [coords] # make it list of polygons
        
    # We want to scale it to fit our 500x650 viewBox.
    # We need to find the bounding box of Bangladesh
    min_lon = 180
    max_lon = -180
    min_lat = 90
    max_lat = -90
    
    for poly in coords:
        for ring in poly:
            for pt in ring:
                lon, lat = pt[0], pt[1]
                min_lon, max_lon = min(min_lon, lon), max(max_lon, lon)
                min_lat, max_lat = min(min_lat, lat), max(max_lat, lat)
                
    width = max_lon - min_lon
    height = max_lat - min_lat
    
    svg_width = 400
    svg_height = 550
    offset_x = 50
    offset_y = 50
    
    scale_x = svg_width / width
    scale_y = svg_height / height
    scale = min(scale_x, scale_y)
    
    d = []
    
    for poly in coords:
        for ring in poly:
            for i, pt in enumerate(ring):
                lon, lat = pt[0], pt[1]
                # Invert Y for SVG coordinates
                x = offset_x + (lon - min_lon) * scale
                y = offset_y + (max_lat - lat) * scale
                
                cmd = "M" if i == 0 else "L"
                d.append(f"{cmd} {x:.1f},{y:.1f}")
            d.append("Z")
            
    print(" ".join(d))
    
    # Calculate Dhaka coordinates (approx 90.4125, 23.8103)
    dhaka_lon, dhaka_lat = 90.4125, 23.8103
    dhaka_x = offset_x + (dhaka_lon - min_lon) * scale
    dhaka_y = offset_y + (max_lat - dhaka_lat) * scale
    print(f"Dhaka Pin: cx='{dhaka_x:.1f}' cy='{dhaka_y:.1f}'")
    
except Exception as e:
    print("Error:", str(e))
