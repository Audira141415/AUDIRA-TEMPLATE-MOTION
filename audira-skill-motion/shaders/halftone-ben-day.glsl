// SHADER: Halftone Ben-Day Dots
// AUDIRA PROCEDURAL SHADER LIBRARY
// Style Fit: comic-book, polyverse, pop-art

uniform vec2 u_resolution;
uniform float u_dot_scale; // e.g. 40.0
uniform vec3 u_ink_color;  // e.g. vec3(0.05, 0.05, 0.08)
uniform sampler2D u_diffuse_map;

varying vec2 v_uv;

void main() {
    vec4 baseColor = texture2D(u_diffuse_map, v_uv);
    float luma = dot(baseColor.rgb, vec3(0.299, 0.587, 0.114));
    
    // Rotate coordinate grid by 45 degrees for classic printer offset
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    
    float angle = 0.785398; // 45 deg in rad
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 rotatedUV = rot * st * u_dot_scale;
    
    vec2 gridPos = fract(rotatedUV) - 0.5;
    float dist = length(gridPos);
    
    // Dot radius inversely proportional to lightness (darker = bigger dot)
    float dotRadius = (1.0 - luma) * 0.52;
    float dotMask = smoothstep(dotRadius, dotRadius - 0.06, dist);
    
    vec3 finalColor = mix(baseColor.rgb, u_ink_color, dotMask);
    gl_FragColor = vec4(finalColor, 1.0);
}

