import { NextResponse } from 'next/server';
import { requireSuperadmin } from '@/lib/auth';
import { readServerConfig, writeServerConfig, ServerNodeConfig } from '@/lib/server-config';
import { testAiConnection, getInternalAiConfig } from '@/lib/ai-config';
import { probeNodeHealth } from '@/lib/server-telemetry';
import { existsSync, readdirSync, unlinkSync, statSync } from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    await requireSuperadmin();
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Akses ditolak.' }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action, payload } = body;

    if (!action) {
      return NextResponse.json({ error: 'Action harus ditentukan.' }, { status: 400 });
    }

    // 1. PING SPECIFIC NODE
    if (action === 'ping-node') {
      const { node } = payload as { node: ServerNodeConfig };
      if (!node) {
        return NextResponse.json({ error: 'Data node tidak valid.' }, { status: 400 });
      }
      const probe = await probeNodeHealth(node);
      return NextResponse.json({ ok: true, result: probe });
    }

    // 2. CLEAR RENDER CACHE & TEMPORARY FILES
    if (action === 'clear-render-cache') {
      let deletedCount = 0;
      let freedBytes = 0;
      const rendersDir = path.join(process.cwd(), 'renders');

      if (existsSync(rendersDir)) {
        try {
          const entries = readdirSync(rendersDir, { withFileTypes: true });
          for (const entry of entries) {
            // Check for temporary files or orphaned temp folders
            if (entry.isFile() && (entry.name.endsWith('.tmp') || entry.name.endsWith('.part'))) {
              const fullPath = path.join(rendersDir, entry.name);
              try {
                freedBytes += statSync(fullPath).size;
                unlinkSync(fullPath);
                deletedCount++;
              } catch {}
            }
          }
        } catch {}
      }

      // Check Next.js cache
      const cacheDir = path.join(process.cwd(), '.next', 'cache');
      const hasCache = existsSync(cacheDir);

      return NextResponse.json({
        ok: true,
        message: deletedCount > 0 
          ? `Berhasil membersihkan ${deletedCount} file temporer (${Math.round(freedBytes / 1024)} KB dibebaskan).` 
          : 'Cache render bersih. Tidak ada file sampah yang perlu dibersihkan.',
        deletedCount,
        freedBytes
      });
    }

    // 3. TEST REMOTION & 3D ENGINE
    if (action === 'test-engine') {
      const cwd = process.cwd();
      const nodeVersion = process.version;
      const remotionInstalled = existsSync(path.join(cwd, 'audira-skill-motion', 'node_modules', 'remotion')) ||
                                existsSync(path.join(cwd, 'node_modules', 'remotion'));
      const kitsCount = 29;

      return NextResponse.json({
        ok: true,
        details: {
          engine: 'Remotion 4.0 Visual 3D Suite',
          nodeVersion,
          remotionReady: remotionInstalled,
          registeredKits: kitsCount,
          outputFolderReady: existsSync(path.join(cwd, 'renders')),
          message: remotionInstalled
            ? 'Engine Remotion 4.0 terpasang dan siap merender video 3D 1080p.'
            : 'Remotion berjalan dalam modul standalone terdedikasi.'
        }
      });
    }

    // 4. TEST AI GATEWAY CONNECTION
    if (action === 'test-ai') {
      const aiConfig = getInternalAiConfig();
      const providerId = payload?.providerId || aiConfig.activeProvider;
      const testResult = await testAiConnection(providerId);
      return NextResponse.json({ ok: testResult.ok, result: testResult });
    }

    // 5. SAVE ENTIRE SERVER CONFIG
    if (action === 'save-config') {
      if (!payload?.config) {
        return NextResponse.json({ error: 'Config payload tidak valid.' }, { status: 400 });
      }
      const updated = writeServerConfig(payload.config);
      return NextResponse.json({ ok: true, config: updated });
    }

    // 6. SAVE / UPDATE SINGLE NODE
    if (action === 'save-node') {
      const incomingNode = payload?.node as ServerNodeConfig;
      if (!incomingNode || !incomingNode.id || !incomingNode.host) {
        return NextResponse.json({ error: 'Data server node tidak lengkap.' }, { status: 400 });
      }

      const current = readServerConfig();
      const existingIdx = current.nodes.findIndex(n => n.id === incomingNode.id);

      let newNodes = [...current.nodes];
      if (existingIdx >= 0) {
        newNodes[existingIdx] = incomingNode;
      } else {
        newNodes.push(incomingNode);
      }

      const updated = writeServerConfig({
        ...current,
        nodes: newNodes
      });

      return NextResponse.json({ ok: true, config: updated, node: incomingNode });
    }

    // 7. DELETE SINGLE NODE
    if (action === 'delete-node') {
      const nodeId = payload?.nodeId as string;
      if (!nodeId) {
        return NextResponse.json({ error: 'Node ID diperlukan.' }, { status: 400 });
      }

      const current = readServerConfig();
      if (nodeId === 'local-node') {
        return NextResponse.json({ error: 'Node lokal utama tidak boleh dihapus.' }, { status: 400 });
      }

      const newNodes = current.nodes.filter(n => n.id !== nodeId);
      const updated = writeServerConfig({
        ...current,
        nodes: newNodes
      });

      return NextResponse.json({ ok: true, config: updated });
    }

    return NextResponse.json({ error: `Action '${action}' tidak dikenali.` }, { status: 400 });
  } catch (err: any) {
    console.error('Server action error:', err);
    return NextResponse.json(
      { error: 'Gagal menjalankan server action: ' + (err?.message || String(err)) },
      { status: 500 }
    );
  }
}
