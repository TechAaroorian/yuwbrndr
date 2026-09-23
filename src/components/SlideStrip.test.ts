import { describe, it, expect } from 'vitest';
import { MAX_SLIDES, StudioSlide } from './SlideStrip';

describe('SlideStrip constants and slide deck operations', () => {
  it('should enforce MAX_SLIDES limit of 6 for carousel carousels', () => {
    expect(MAX_SLIDES).toBe(6);
  });

  it('should support slide structure with unique IDs and code types', () => {
    const initialSlide: StudioSlide = {
      id: 'slide-1',
      name: 'Slide 1: Hook',
      codeType: 'html',
      code: '<div class="p-8">Hook Slide</div>',
    };

    expect(initialSlide.id).toBe('slide-1');
    expect(initialSlide.codeType).toBe('html');
    expect(initialSlide.name).toBe('Slide 1: Hook');
  });

  it('should simulate adding slides up to MAX_SLIDES', () => {
    const slides: StudioSlide[] = [
      { id: 'slide-1', name: 'Slide 1', codeType: 'html', code: '' },
    ];

    const addSlide = (currentSlides: StudioSlide[]): StudioSlide[] => {
      if (currentSlides.length >= MAX_SLIDES) return currentSlides;
      const nextIndex = currentSlides.length + 1;
      return [
        ...currentSlides,
        {
          id: `slide-${nextIndex}`,
          name: `Slide ${nextIndex}`,
          codeType: 'html',
          code: '',
        },
      ];
    };

    let list = slides;
    for (let i = 1; i < MAX_SLIDES; i++) {
      list = addSlide(list);
    }
    expect(list.length).toBe(MAX_SLIDES);

    // Attempting to add beyond MAX_SLIDES should be a no-op
    const overflow = addSlide(list);
    expect(overflow.length).toBe(MAX_SLIDES);
  });

  it('should simulate duplicating an active slide with a new ID', () => {
    const slides: StudioSlide[] = [
      { id: 'slide-1', name: 'Architecture Overview', codeType: 'html', code: '<div>Architecture</div>' },
    ];

    const duplicateSlide = (currentSlides: StudioSlide[], activeId: string): StudioSlide[] => {
      if (currentSlides.length >= MAX_SLIDES) return currentSlides;
      const target = currentSlides.find((s) => s.id === activeId);
      if (!target) return currentSlides;
      const newSlide: StudioSlide = {
        ...target,
        id: `slide-copy-${Date.now()}`,
        name: `${target.name} (Copy)`,
      };
      return [...currentSlides, newSlide];
    };

    const updated = duplicateSlide(slides, 'slide-1');
    expect(updated.length).toBe(2);
    expect(updated[1].name).toBe('Architecture Overview (Copy)');
    expect(updated[1].code).toBe('<div>Architecture</div>');
    expect(updated[1].id).not.toBe('slide-1');
  });

  it('should not allow deleting the last remaining slide', () => {
    const singleSlide: StudioSlide[] = [
      { id: 'slide-1', name: 'Slide 1', codeType: 'html', code: '' },
    ];

    const deleteSlide = (currentSlides: StudioSlide[], targetId: string): StudioSlide[] => {
      if (currentSlides.length <= 1) return currentSlides;
      return currentSlides.filter((s) => s.id !== targetId);
    };

    const result = deleteSlide(singleSlide, 'slide-1');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('slide-1');
  });
});
