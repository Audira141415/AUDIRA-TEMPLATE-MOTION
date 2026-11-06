// SHADER: Sci-Fi Hologram Fresnel & Elevation Scan Beam
// AUDIRA PROCEDURAL SHADER LIBRARY
// Style Fit: futuristic-hud, cyberforge, devforge

uniform float u_time;
uniform vec3 u_glow_color; // e.g. vec3(0.0, 0.94, 1.0)
uniform float u_scan_speed; // e.g. 2.5

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_view_dir;
varying vec3 v_world_position;

void main() {
    // 1. Fresnel edge glow
    float fresnel = pow(1.0 - max(dot(normalize(v_normal), normalize(v_view_dir)), 0.0), 2.5);
    
    // 2. Animated vertical laser scan beam
    float scanPos = mod(v_world_position.y * 3.0 - u_time * u_scan_speed, 6.28318);
    float scanBeam = smoothstep(0.85, 1.0, sin(scanPos));
    
    // 3. Subtle grid scanlines
    float grid = sin(v_world_position.y * 80.0) * 0.15;
    
    // Combine emissive intensity
    float alpha = fresnel * 0.75 + scanBeam * 0.65 + grid;
    alpha = clamp(alpha, 0.08, 0.95);
    
    vec3 finalGlow = u_glow_color * (1.2 + scanBeam * 1.5);
    gl_FragColor = vec4(finalGlow, alpha);
}

