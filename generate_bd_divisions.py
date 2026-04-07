import urllib.request
import json

url = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/bangladesh.geojson"
try:
    with urllib.request.urlopen(url) as response:
        data = json.loads(response.read().decode('utf-8'))
        
    features = data["features"]
    
    # Get all points
    points = []
    for f in features:
        geom = f["geometry"]
        coords = geom["coordinates"]
        if geom["type"] == "Polygon":
            coords = [coords]
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
    
    for f in features:
        geom = f["geometry"]
        coords = geom["coordinates"]
        if geom["type"] == "Polygon":
            coords = [coords]
            
        div_name = f["properties"].get("name", "Unknown")
        # Simplify each path slightly to keep size small? We'll just take every nth point, or keep all if small.
        for j, poly in enumerate(coords):
            d = []
            for ring in poly:
                for i, pt in enumerate(ring):
                    if i % 2 != 0 and i != 0 and i != len(ring)-1:
                         continue # simple decimation to reduce size
                    lon, lat = pt[0], pt[1]
                    x = offset_x + (lon - min_lon) * scale
                    y = offset_y + (max_lat - lat) * scale
                    
                    cmd = "M" if i == 0 else "L"
                    d.append(f"{cmd}{x:.1f},{y:.1f}")
                d.append("Z")
            
            # Print an SVG path for each division with a class/id
            print(f'<path class="map-bd-region" id="{div_name.replace(" ", "_").lower()}_{j}" d="{" ".join(d)}" />\n')
    
    dhaka_lon, dhaka_lat = 90.4125, 23.8103
    dhaka_x = offset_x + (dhaka_lon - min_lon) * scale
    dhaka_y = offset_y + (max_lat - dhaka_lat) * scale
    print(f"\n<!-- Dhaka Position: cx='{dhaka_x:.1f}' cy='{dhaka_y:.1f}' -->")
    
except Exception as e:
    print(e)
