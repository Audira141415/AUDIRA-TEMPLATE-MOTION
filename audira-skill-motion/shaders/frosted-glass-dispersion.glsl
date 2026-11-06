// SHADER: VisionOS Frosted Glass & Chromatic Dispersion
// AUDIRA PROCEDURAL SHADER LIBRARY
// Style Fit: glassmorphism, glasscraft, precision-cgi

uniform vec2 u_resolution;
uniform float u_blur_radius; // e.g. 0.015
uniform float u_dispersion;  // Chromatic aberration strength e.g. 0.008
uniform sampler2D u_scene_texture;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_view_dir;

void main() {
    // Fresnel rim factor
    float fresnel = pow(1.0 - max(dot(normalize(v_normal), normalize(v_view_dir)), 0.0), 3.0);
    
    // Chromatic dispersion sampling (Red, Green, Blue shifted)
    vec2 dir = normalize(v_uv - 0.5);
    float r = texture2D(u_scene_texture, v_uv + dir * (u_dispersion * 1.5)).r;
    float g = texture2D(u_scene_texture, v_uv).g;
    float b = texture2D(u_scene_texture, v_uv - dir * (u_dispersion * 1.5)).b;
    
    vec3 dispersedColor = vec3(r, g, b);
    
    // Add frosted white edge sheen
    vec3 glassColor = mix(dispersedColor, vec3(1.0, 1.0, 1.0), fresnel * 0.45);
    
    gl_FragColor = vec4(glassColor, 0.88);
}

