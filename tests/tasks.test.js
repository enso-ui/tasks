import { describe, expect, it, vi } from 'vitest';

vi.mock('@enso-ui/enums/src/pinia/enums', () => ({
    enums: () => ({
        enums: {
            roles: { Admin: '1', Supervisor: '2' },
            flags: {
                _keys: vi.fn(() => ['1', '2']),
                Success: '1',
                Info: '2',
                Warning: '3',
                Danger: '4',
            },
        },
    }),
}));

vi.mock('@enso-ui/ui/src/pinia/app', () => ({
    app: () => ({
        user: { role: { id: 1 } },
        meta: { dateFormat: 'd.m.Y', dateTimeFormat: 'd.m.Y H:i:s' },
    }),
}));

vi.mock('@enso-ui/ui/src/pinia/layout', () => ({
    layout: () => ({
        isTouch: true,
    }),
}));

vi.mock('@enso-ui/ui/src/pinia/websockets', () => ({
    websockets: () => ({
        channels: { task: 'task-channel' },
    }),
}));

vi.mock('@enso-ui/ui/src/modules/plugins/date-fns/format', () => ({
    default: vi.fn(),
}));

import NavbarTasks from '../src/core/components/navbar/Tasks.vue';
import Flags from '../src/bulma/pages/tasks/components/Flags.vue';

describe('tasks state access', () => {
    it('uses stores directly in navbar tasks', () => {
        expect(NavbarTasks.computed.channels.call({})).toEqual({ task: 'task-channel' });
        expect(NavbarTasks.computed.isTouch.call({})).toBe(true);
    });

    it('uses enum store directly in flags', () => {
        expect(Flags.computed.enums.call({})).toEqual(expect.objectContaining({
            roles: { Admin: '1', Supervisor: '2' },
        }));
    });
});
