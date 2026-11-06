// SHADER: Clay Stipple & Procedural Thumbprint Normal
// AUDIRA PROCEDURAL SHADER LIBRARY
// Style Fit: claymation, clayworld, 3d-toy-diorama

uniform float u_time;
uniform float u_stipple_scale; // e.g. 120.0
uniform float u_thumbprint_depth; // e.g. 0.08

varying vec2 v_uv;
varying vec3 v_normal;

// Simple hash-based 2D noise
float hash(vec2 p) {
    p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
    return -1.0 + 2.0 * fract(16.0 * fract(p.x * p.y * (p.x + p.y)));
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
    // Generate fine clay pores
    float fineGrain = noise(v_uv * u_stipple_scale) * 0.05;
    
    // Generate organic concentric fingerprint ridges
    vec2 thumbCenter = vec2(0.5, 0.5);
    float d = length(v_uv - thumbCenter) * 35.0;
    float ridges = sin(d + noise(v_uv * 10.0) * 2.0) * u_thumbprint_depth;
    
    vec3 modifiedNormal = normalize(v_normal + vec3(fineGrain + ridges, fineGrain + ridges, 0.0));
    
    // Output normal encoded as RGB
    gl_FragColor = vec4(modifiedNormal * 0.5 + 0.5, 1.0);
}

