import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Box,
    VStack,
    HStack,
    Text,
    Button,
    useToast,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Switch,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Select,
    Divider,
    Badge,
    Avatar,
    useColorModeValue,
} from "@chakra-ui/react";
import {
    Settings,
    Save,
    RefreshCw,
    Bell,
    Shield,
    Database,
    Palette,
    Globe,
    User,
    Mail,
    Lock,
} from "lucide-react";

const SettingsPage = () => {
    const [settings, setSettings] = useState({
        // General Settings
        siteName: "E-DTC",
        siteDescription: "Digital Text Center",
        siteUrl: "https://edtc.com",
        adminEmail: "admin@edtc.com",

        // Notification Settings
        emailNotifications: true,
        pushNotifications: false,
        weeklyReports: true,
        userActivityAlerts: true,

        // Security Settings
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordPolicy: "medium",
        loginAttempts: 5,

        // System Settings
        autoBackup: true,
        backupFrequency: "daily",
        maintenanceMode: false,
        debugMode: false,

        // Appearance Settings
        theme: "light",
        primaryColor: "blue",
        sidebarCollapsed: false,
        compactMode: false,
    });

    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Pengaturan Disimpan",
                description: "Semua pengaturan telah berhasil disimpan.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Gagal menyimpan pengaturan.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSettings({
            siteName: "E-DTC",
            siteDescription: "Digital Text Center",
            siteUrl: "https://edtc.com",
            adminEmail: "admin@edtc.com",
            emailNotifications: true,
            pushNotifications: false,
            weeklyReports: true,
            userActivityAlerts: true,
            twoFactorAuth: false,
            sessionTimeout: 30,
            passwordPolicy: "medium",
            loginAttempts: 5,
            autoBackup: true,
            backupFrequency: "daily",
            maintenanceMode: false,
            debugMode: false,
            theme: "light",
            primaryColor: "blue",
            sidebarCollapsed: false,
            compactMode: false,
        });

        toast({
            title: "Pengaturan Direset",
            description: "Semua pengaturan telah dikembalikan ke default.",
            status: "info",
            duration: 3000,
            isClosable: true,
        });
    };

    const SettingCard = ({ title, icon, children }) => (
        <Card
            bg="white"
            shadow="sm"
            borderRadius="lg"
            border="1px"
            borderColor="gray.100"
        >
            <CardHeader pb={4}>
                <HStack spacing={3}>
                    <Box p={2} bg="blue.50" borderRadius="lg" color="blue.600">
                        {icon}
                    </Box>
                    <Text fontSize="lg" fontWeight="600" color="gray.800">
                        {title}
                    </Text>
                </HStack>
            </CardHeader>
            <CardBody pt={0}>{children}</CardBody>
        </Card>
    );

    const SettingItem = ({ label, description, children }) => (
        <VStack
            align="stretch"
            spacing={2}
            p={4}
            bg="gray.50"
            borderRadius="md"
        >
            <VStack align="start" spacing={1}>
                <Text fontSize="sm" fontWeight="500" color="gray.800">
                    {label}
                </Text>
                {description && (
                    <Text fontSize="xs" color="gray.600">
                        {description}
                    </Text>
                )}
            </VStack>
            {children}
        </VStack>
    );

    return (
        <Box bg="gray.50" minH="100vh" p={6}>
            <VStack spacing={8} align="stretch" maxW="1000px" mx="auto">
                {/* Header */}
                <Flex justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            Pengaturan
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Kelola konfigurasi sistem dan preferensi
                        </Text>
                    </VStack>

                    <HStack spacing={3}>
                        <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={handleReset}
                            bg="white"
                            color="gray.700"
                            border="1px"
                            borderColor="gray.200"
                        >
                            Reset
                        </Button>

                        <Button
                            size="sm"
                            leftIcon={<Save size={16} />}
                            onClick={handleSave}
                            isLoading={isLoading}
                            colorScheme="blue"
                        >
                            Simpan
                        </Button>
                    </HStack>
                </Flex>

                {/* General Settings */}
                <SettingCard
                    title="Pengaturan Umum"
                    icon={<Settings size={20} />}
                >
                    <VStack spacing={4} align="stretch">
                        <SettingItem
                            label="Nama Situs"
                            description="Nama yang akan ditampilkan di header dan title"
                        >
                            <Input
                                value={settings.siteName}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        siteName: e.target.value,
                                    })
                                }
                                placeholder="Masukkan nama situs"
                                size="sm"
                            />
                        </SettingItem>

                        <SettingItem
                            label="Deskripsi Situs"
                            description="Deskripsi singkat tentang platform"
                        >
                            <Textarea
                                value={settings.siteDescription}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        siteDescription: e.target.value,
                                    })
                                }
                                placeholder="Masukkan deskripsi situs"
                                size="sm"
                                rows={3}
                            />
                        </SettingItem>

                        <HStack spacing={4}>
                            <SettingItem
                                label="URL Situs"
                                description="Alamat website utama"
                            >
                                <Input
                                    value={settings.siteUrl}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            siteUrl: e.target.value,
                                        })
                                    }
                                    placeholder="https://example.com"
                                    size="sm"
                                />
                            </SettingItem>

                            <SettingItem
                                label="Email Admin"
                                description="Email administrator utama"
                            >
                                <Input
                                    value={settings.adminEmail}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            adminEmail: e.target.value,
                                        })
                                    }
                                    placeholder="admin@example.com"
                                    size="sm"
                                />
                            </SettingItem>
                        </HStack>
                    </VStack>
                </SettingCard>

                {/* Notification Settings */}
                <SettingCard title="Notifikasi" icon={<Bell size={20} />}>
                    <VStack spacing={4} align="stretch">
                        <SettingItem
                            label="Notifikasi Email"
                            description="Mengirim notifikasi melalui email"
                        >
                            <Switch
                                isChecked={settings.emailNotifications}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        emailNotifications: e.target.checked,
                                    })
                                }
                                colorScheme="blue"
                            />
                        </SettingItem>

                        <SettingItem
                            label="Notifikasi Push"
                            description="Mengirim notifikasi push ke browser"
                        >
                            <Switch
                                isChecked={settings.pushNotifications}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        pushNotifications: e.target.checked,
                                    })
                                }
                                colorScheme="blue"
                            />
                        </SettingItem>

                        <SettingItem
                            label="Laporan Mingguan"
                            description="Mengirim laporan statistik mingguan"
                        >
                            <Switch
                                isChecked={settings.weeklyReports}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        weeklyReports: e.target.checked,
                                    })
                                }
                                colorScheme="blue"
                            />
                        </SettingItem>

                        <SettingItem
                            label="Alert Aktivitas Pengguna"
                            description="Notifikasi untuk aktivitas pengguna yang mencurigakan"
                        >
                            <Switch
                                isChecked={settings.userActivityAlerts}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        userActivityAlerts: e.target.checked,
                                    })
                                }
                                colorScheme="blue"
                            />
                        </SettingItem>
                    </VStack>
                </SettingCard>

                {/* Security Settings */}
                <SettingCard title="Keamanan" icon={<Shield size={20} />}>
                    <VStack spacing={4} align="stretch">
                        <SettingItem
                            label="Two-Factor Authentication"
                            description="Mengaktifkan 2FA untuk keamanan ekstra"
                        >
                            <Switch
                                isChecked={settings.twoFactorAuth}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        twoFactorAuth: e.target.checked,
                                    })
                                }
                                colorScheme="blue"
                            />
                        </SettingItem>

                        <HStack spacing={4}>
                            <SettingItem
                                label="Session Timeout (menit)"
                                description="Durasi sesi sebelum logout otomatis"
                            >
                                <Input
                                    type="number"
                                    value={settings.sessionTimeout}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            sessionTimeout: parseInt(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    size="sm"
                                    w="120px"
                                />
                            </SettingItem>

                            <SettingItem
                                label="Kebijakan Password"
                                description="Tingkat keamanan password"
                            >
                                <Select
                                    value={settings.passwordPolicy}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            passwordPolicy: e.target.value,
                                        })
                                    }
                                    size="sm"
                                    w="150px"
                                >
                                    <option value="low">Rendah</option>
                                    <option value="medium">Sedang</option>
                                    <option value="high">Tinggi</option>
                                </Select>
                            </SettingItem>
                        </HStack>

                        <SettingItem
                            label="Maksimal Percobaan Login"
                            description="Jumlah percobaan login yang diizinkan"
                        >
                            <Input
                                type="number"
                                value={settings.loginAttempts}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        loginAttempts: parseInt(e.target.value),
                                    })
                                }
                                size="sm"
                                w="120px"
                            />
                        </SettingItem>
                    </VStack>
                </SettingCard>

                {/* System Settings */}
                <SettingCard title="Sistem" icon={<Database size={20} />}>
                    <VStack spacing={4} align="stretch">
                        <SettingItem
                            label="Backup Otomatis"
                            description="Membuat backup database secara otomatis"
                        >
                            <Switch
                                isChecked={settings.autoBackup}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        autoBackup: e.target.checked,
                                    })
                                }
                                colorScheme="blue"
                            />
                        </SettingItem>

                        <HStack spacing={4}>
                            <SettingItem
                                label="Frekuensi Backup"
                                description="Seberapa sering backup dilakukan"
                            >
                                <Select
                                    value={settings.backupFrequency}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            backupFrequency: e.target.value,
                                        })
                                    }
                                    size="sm"
                                    w="150px"
                                >
                                    <option value="daily">Harian</option>
                                    <option value="weekly">Mingguan</option>
                                    <option value="monthly">Bulanan</option>
                                </Select>
                            </SettingItem>

                            <SettingItem
                                label="Mode Maintenance"
                                description="Menutup akses sementara untuk maintenance"
                            >
                                <Switch
                                    isChecked={settings.maintenanceMode}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            maintenanceMode: e.target.checked,
                                        })
                                    }
                                    colorScheme="red"
                                />
                            </SettingItem>
                        </HStack>

                        <SettingItem
                            label="Mode Debug"
                            description="Menampilkan informasi debug untuk pengembangan"
                        >
                            <Switch
                                isChecked={settings.debugMode}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        debugMode: e.target.checked,
                                    })
                                }
                                colorScheme="orange"
                            />
                        </SettingItem>
                    </VStack>
                </SettingCard>

                {/* Appearance Settings */}
                <SettingCard title="Tampilan" icon={<Palette size={20} />}>
                    <VStack spacing={4} align="stretch">
                        <HStack spacing={4}>
                            <SettingItem
                                label="Tema"
                                description="Pilih tema tampilan"
                            >
                                <Select
                                    value={settings.theme}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            theme: e.target.value,
                                        })
                                    }
                                    size="sm"
                                    w="150px"
                                >
                                    <option value="light">Terang</option>
                                    <option value="dark">Gelap</option>
                                    <option value="auto">Otomatis</option>
                                </Select>
                            </SettingItem>

                            <SettingItem
                                label="Warna Utama"
                                description="Warna tema utama"
                            >
                                <Select
                                    value={settings.primaryColor}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            primaryColor: e.target.value,
                                        })
                                    }
                                    size="sm"
                                    w="150px"
                                >
                                    <option value="blue">Biru</option>
                                    <option value="green">Hijau</option>
                                    <option value="purple">Ungu</option>
                                    <option value="orange">Orange</option>
                                </Select>
                            </SettingItem>
                        </HStack>

                        <HStack spacing={4}>
                            <SettingItem
                                label="Sidebar Collapsed"
                                description="Sidebar dalam keadaan collapsed"
                            >
                                <Switch
                                    isChecked={settings.sidebarCollapsed}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            sidebarCollapsed: e.target.checked,
                                        })
                                    }
                                    colorScheme="blue"
                                />
                            </SettingItem>

                            <SettingItem
                                label="Mode Compact"
                                description="Tampilan yang lebih compact"
                            >
                                <Switch
                                    isChecked={settings.compactMode}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            compactMode: e.target.checked,
                                        })
                                    }
                                    colorScheme="blue"
                                />
                            </SettingItem>
                        </HStack>
                    </VStack>
                </SettingCard>

                {/* System Info */}
                <Card
                    bg="white"
                    shadow="sm"
                    borderRadius="lg"
                    border="1px"
                    borderColor="gray.100"
                >
                    <CardHeader>
                        <HStack spacing={3}>
                            <Box
                                p={2}
                                bg="green.50"
                                borderRadius="lg"
                                color="green.600"
                            >
                                <Globe size={20} />
                            </Box>
                            <Text
                                fontSize="lg"
                                fontWeight="600"
                                color="gray.800"
                            >
                                Informasi Sistem
                            </Text>
                        </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                        <VStack spacing={3} align="stretch">
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                    Versi Sistem
                                </Text>
                                <Badge colorScheme="green">v1.0.0</Badge>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                    Status Server
                                </Text>
                                <Badge colorScheme="green">Online</Badge>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                    Database
                                </Text>
                                <Badge colorScheme="blue">SQLite</Badge>
                            </HStack>
                            <HStack justify="space-between">
                                <Text fontSize="sm" color="gray.600">
                                    Terakhir Update
                                </Text>
                                <Text fontSize="sm" color="gray.800">
                                    2 jam yang lalu
                                </Text>
                            </HStack>
                        </VStack>
                    </CardBody>
                </Card>
            </VStack>
        </Box>
    );
};

export default SettingsPage;
