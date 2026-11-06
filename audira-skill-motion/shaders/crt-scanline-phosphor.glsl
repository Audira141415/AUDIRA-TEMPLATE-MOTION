// SHADER: Retro CRT Scanlines & Screen Curvature
// AUDIRA PROCEDURAL SHADER LIBRARY
// Style Fit: retro-synthwave, retrowave, pixel-art

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_curvature; // e.g. 0.08 for subtle CRT bulge
uniform sampler2D u_diffuse_texture;

varying vec2 v_uv;

vec2 curve(vec2 uv) {
    uv = (uv - 0.5) * 2.0;
    uv *= 1.1;
    uv.x *= 1.0 + pow((abs(uv.y) / 5.0), 2.0);
    uv.y *= 1.0 + pow((abs(uv.x) / 4.0), 2.0);
    uv  = (uv / 2.0) + 0.5;
    return uv;
}

void main() {
    vec2 curvedUV = curve(v_uv);
    
    // Black border outside CRT glass
    if (curvedUV.x < 0.0 || curvedUV.x > 1.0 || curvedUV.y < 0.0 || curvedUV.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }
    
    vec4 col = texture2D(u_diffuse_texture, curvedUV);
    
    // Horizontal scanlines
    float scanline = sin(curvedUV.y * u_resolution.y * 1.5) * 0.12;
    col.rgb -= scanline;
    
    // Phosphor RGB triad simulation
    float phosphor = mod(gl_FragCoord.x, 3.0);
    if (phosphor < 1.0) col.r *= 1.15;
    else if (phosphor < 2.0) col.g *= 1.15;
    else col.b *= 1.15;
    
    // Subtle vignette
    float vignette = curvedUV.x * (1.0 - curvedUV.x) * curvedUV.y * (1.0 - curvedUV.y);
    col.rgb *= clamp(pow(16.0 * vignette, 0.25), 0.0, 1.0);
    
    gl_FragColor = col;
}

