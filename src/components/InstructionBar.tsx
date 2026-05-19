import { useGeometryStore } from '../store/useGeometryStore';

export function InstructionBar() {
  const currentTool = useGeometryStore((s) => s.currentTool);
  const selection = useGeometryStore((s) => s.selection);

  const instructions: Record<string, { step: number; text: string } | { idle: { step: number; text: string }; one: { step: number; text: string }; two?: { step: number; text: string }; three?: { step: number; text: string } }> = {
    ruler: { idle: { step: 1, text: 'Click to place the starting point' }, one: { step: 2, text: 'Click to place the end point (Shift for straight)' } },
    protractor: { idle: { step: 1, text: 'Click to place the protractor center' }, one: { step: 2, text: 'Move mouse to set angle, click Draw Ray' } },
    compass: { idle: { step: 1, text: 'Click to place compass center' }, one: { step: 2, text: 'Click to set radius' }, two: { step: 3, text: 'Click to mark arc START or Full Circle' }, three: { step: 4, text: 'Click to mark arc END' } },
    point: { step: 1, text: 'Click to place a point' },
    text: { step: 1, text: 'Click to place text \u00B7 Double-click to edit' },
    hand: { step: 1, text: 'Click and drag to pan (or hold Space)' },
    intersect: { step: 1, text: 'Click to find intersections' },
    move: { step: 1, text: 'Drag points/labels \u00B7 Ctrl+A select all \u00B7 Arrows to nudge' },
    eraser: { step: 1, text: 'Click to erase' },
  };

  const inst = instructions[currentTool];
  let step = 1;
  let text = '';

  if ('idle' in inst) {
    const idx = selection.length;
    if (currentTool === 'compass' && idx === 2) {
      step = inst.two?.step ?? 3;
      text = inst.two?.text ?? '';
    } else if (currentTool === 'compass' && idx === 3) {
      step = inst.three?.step ?? 4;
      text = inst.three?.text ?? '';
    } else if (idx === 0) {
      step = inst.idle.step;
      text = inst.idle.text;
    } else {
      step = inst.one.step;
      text = inst.one.text;
    }
  } else {
    step = inst.step;
    text = inst.text;
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(14, 165, 169, 0.95)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: 10,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 50,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        {step}
      </div>
      <span>{text}</span>
    </div>
  );
}
