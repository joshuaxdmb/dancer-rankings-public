import { SafeArea, SafeAreaInsets } from 'capacitor-plugin-safe-area';

class DeviceSafeArea {
    public safeAreaInsets = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    };

    public constructor() {
        this.initialize();
    }

    private async initialize(): Promise<void> {
        await this.fetchInsets();
    }

    private async fetchInsets(): Promise<void> {
        try {
            const insets: SafeAreaInsets = await SafeArea.getSafeAreaInsets();
            this.safeAreaInsets = insets.insets;
        } catch (error) {
            console.error('Error getting safe area insets:', error);
        }
    }

    public getTopInset(): number {
        return this.safeAreaInsets.top;
    }
}

const instance = new DeviceSafeArea
export default instance
