import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================
// KONFIGURASI (FINAL VERSION)
// ==============================
const config = {
    /**
     * ROOT Laravel = folder oguri-chibi
     */
    laravelPath: process.argv[2]
        ? path.resolve(process.argv[2])
        : __dirname,

    /**
     * Output file di folder yang sama
     */
    outputFile: path.join(__dirname, 'laravel-structure.txt'),

    /**
     * Folder yang di-skip SEPENUHNYA
     */
    skipFolders: [
        'node_modules',
        'vendor',
        '.git',
        'storage/framework/views',
        'storage/framework/cache',
        'storage/framework/sessions',
        'storage/framework/testing',
        'storage/logs',
        'storage/app',
        'bootstrap/cache'
    ],

    /**
     * File yang di-skip (bawaan Laravel)
     */
    skipFiles: [
        '.env',              // SKIP .env
        '.env.example',
        'composer.json',
        'composer.lock',
        'package.json',
        'package-lock.json',
        'phpunit.xml',
        'webpack.mix.js',
        'vite.config.js',
        '.gitignore',
        '.editorconfig',
        'README.md',
        'artisan',
        'server.php',
        '.gitattributes',
        'CHANGELOG.md',
        'LICENSE.md',
        '.htaccess'
    ],

    /**
     * Folder yang HANYA ambil file custom (skip file bawaan)
     */
    partialSkipFolders: {
        'app/Http/Controllers': ['Controller.php'],
        'app/Models': ['User.php'],
        'app/Providers': ['AppServiceProvider.php', 'RouteServiceProvider.php'],
        'config': ['app.php', 'auth.php', 'cache.php', 'database.php',
                   'filesystems.php', 'logging.php', 'mail.php',
                   'queue.php', 'services.php', 'session.php'],
        'routes': [],  // AMBIL SEMUA ROUTES (termasuk web.php & api.php)
        'database/migrations': [
            '0001_01_01_000000_create_users_table.php',
            '0001_01_01_000001_create_cache_table.php',
            '0001_01_01_000002_create_jobs_table.php'
        ],
        'database/seeders': [],  // AMBIL SEMUA SEEDERS (termasuk DatabaseSeeder.php)
        'database/factories': ['UserFactory.php'],
        'tests/Feature': ['ExampleTest.php'],
        'tests/Unit': ['ExampleTest.php'],
        'resources/views': [],  // AMBIL SEMUA VIEWS (termasuk welcome.blade.php)
        'bootstrap': ['app.php', 'providers.php']
    },

    /**
     * File kode yang diambil
     */
    codeExtensions: [
        '.php',
        '.js',
        '.vue',
        '.blade.php',
        '.css',
        '.scss',
        '.json',
        '.yaml',
        '.yml',
        '.md'
    ],

    /**
     * File gambar
     */
    imageExtensions: [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.svg',
        '.ico',
        '.webp'
    ],

    /**
     * File audio
     */
    audioExtensions: [
        '.mp3',
        '.wav',
        '.ogg',
        '.m4a'
    ],

    /**
     * Ekstensi yang selalu diabaikan
     */
    alwaysSkipExtensions: [
        '.log',
        '.cache',
        '.tmp',
        '.swp',
        '.DS_Store'
    ]
};


class LaravelExtractor {
    constructor(config) {
        this.config = config;
        this.codeFiles = [];
        this.imageFiles = [];
        this.audioFiles = [];
        this.emptyFolders = [];
        this.fileTree = [];
        this.stats = {
            totalScanned: 0,
            skippedLaravel: 0,
            customFiles: 0
        };
    }

    shouldSkipFolder(folderPath) {
        const relativePath = path.relative(this.config.laravelPath, folderPath);
        const normalizedPath = relativePath.replace(/\\/g, '/');

        return this.config.skipFolders.some(skip => {
            const normalizedSkip = skip.replace(/\\/g, '/');
            return normalizedPath === normalizedSkip ||
                   normalizedPath.startsWith(normalizedSkip + '/');
        });
    }

    shouldSkipFile(filePath, fileName) {
        // Skip file umum
        if (this.config.skipFiles.includes(fileName)) {
            this.stats.skippedLaravel++;
            return true;
        }

        // Skip berdasarkan ekstensi
        if (this.config.alwaysSkipExtensions.some(ext => fileName.endsWith(ext))) {
            return true;
        }

        // Cek partial skip (folder tertentu)
        const relativePath = path.relative(this.config.laravelPath, filePath);
        const normalizedPath = relativePath.replace(/\\/g, '/');

        for (const [folder, skipFiles] of Object.entries(this.config.partialSkipFolders)) {
            const normalizedFolder = folder.replace(/\\/g, '/');

            if (normalizedPath.startsWith(normalizedFolder + '/')) {
                const shouldSkip = skipFiles.includes(fileName);

                if (shouldSkip) {
                    this.stats.skippedLaravel++;
                }

                return shouldSkip;
            }
        }

        return false;
    }

    isCodeFile(fileName) {
        return this.config.codeExtensions.some(ext => fileName.endsWith(ext));
    }

    isImageFile(fileName) {
        return this.config.imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    isAudioFile(fileName) {
        return this.config.audioExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }

    getRelativePath(fullPath) {
        return path.relative(this.config.laravelPath, fullPath).replace(/\\/g, '/');
    }

    async readFileContent(filePath) {
        try {
            return await fs.promises.readFile(filePath, 'utf8');
        } catch (error) {
            return `Error membaca file: ${error.message}`;
        }
    }

    async scanDirectory(dirPath, depth = 0) {
        if (this.shouldSkipFolder(dirPath)) {
            return;
        }

        try {
            const items = await fs.promises.readdir(dirPath, { withFileTypes: true });

            // Cek apakah folder kosong (hanya ada file yang di-skip)
            const validItems = [];
            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);

                if (item.isDirectory()) {
                    if (!this.shouldSkipFolder(fullPath)) {
                        validItems.push(item);
                    }
                } else {
                    if (!this.shouldSkipFile(fullPath, item.name)) {
                        validItems.push(item);
                    }
                }
            }

            // Tandai sebagai folder kosong jika tidak ada file valid
            if (validItems.length === 0 && dirPath !== this.config.laravelPath) {
                this.emptyFolders.push(this.getRelativePath(dirPath));
                return;
            }

            // Build tree structure
            for (const item of items) {
                const fullPath = path.join(dirPath, item.name);
                const relativePath = this.getRelativePath(fullPath);

                if (item.isDirectory() && !this.shouldSkipFolder(fullPath)) {
                    this.fileTree.push({
                        type: 'directory',
                        path: relativePath,
                        depth: depth
                    });
                    await this.scanDirectory(fullPath, depth + 1);
                } else if (!this.shouldSkipFile(fullPath, item.name)) {
                    this.fileTree.push({
                        type: 'file',
                        path: relativePath,
                        depth: depth,
                        name: item.name
                    });
                    await this.processFile(fullPath, item.name);
                }
            }
        } catch (error) {
            console.error(`Error scanning directory ${dirPath}:`, error.message);
        }
    }

    async processFile(fullPath, fileName) {
        this.stats.totalScanned++;

        if (this.shouldSkipFile(fullPath, fileName)) {
            return;
        }

        this.stats.customFiles++;
        const relativePath = this.getRelativePath(fullPath);

        // Proses file gambar
        if (this.isImageFile(fileName)) {
            this.imageFiles.push({
                path: relativePath,
                fileName: fileName
            });
            return;
        }

        // Proses file audio
        if (this.isAudioFile(fileName)) {
            this.audioFiles.push({
                path: relativePath,
                fileName: fileName
            });
            return;
        }

        // Proses file kode
        if (this.isCodeFile(fileName)) {
            const content = await this.readFileContent(fullPath);
            this.codeFiles.push({
                path: relativePath,
                content: content
            });
        }
    }

    generateTreeStructure() {
        let tree = '';
        const processed = new Set();

        // Group by directory
        const structure = {};

        for (const item of this.fileTree) {
            const parts = item.path.split('/');
            let current = structure;

            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];

                if (!current[part]) {
                    current[part] = {
                        type: i === parts.length - 1 ? item.type : 'directory',
                        children: {}
                    };
                }

                current = current[part].children;
            }
        }

        // Build tree string
        const buildTree = (obj, prefix = '', isLast = true) => {
            const keys = Object.keys(obj).sort((a, b) => {
                // Directories first
                if (obj[a].type === 'directory' && obj[b].type === 'file') return -1;
                if (obj[a].type === 'file' && obj[b].type === 'directory') return 1;
                return a.localeCompare(b);
            });

            keys.forEach((key, index) => {
                const item = obj[key];
                const isLastItem = index === keys.length - 1;
                const connector = isLastItem ? '└── ' : '├── ';
                const extension = isLastItem ? '    ' : '│   ';

                tree += prefix + connector + key + (item.type === 'directory' ? '/' : '') + '\n';

                if (item.type === 'directory' && Object.keys(item.children).length > 0) {
                    buildTree(item.children, prefix + extension, isLastItem);
                }
            });
        };

        buildTree(structure);
        return tree;
    }

    generateOutput() {
        let output = '='.repeat(80) + '\n';
        output += 'STRUKTUR FILE LARAVEL PROJECT - OGURI CHIBI\n';
        output += 'File yang dibuat/diubah (bukan bawaan Laravel)\n';
        output += '='.repeat(80) + '\n\n';

        // SECTION 1: TREE STRUCTURE
        output += '╔' + '═'.repeat(78) + '╗\n';
        output += '║' + ' '.repeat(25) + '📁 STRUKTUR FILE TREE' + ' '.repeat(32) + '║\n';
        output += '╚' + '═'.repeat(78) + '╝\n\n';

        output += this.generateTreeStructure();
        output += '\n';

        // SECTION 2: KODE FILES
        output += '\n' + '╔' + '═'.repeat(78) + '╗\n';
        output += '║' + ' '.repeat(28) + '📝 FILE KODE' + ' '.repeat(38) + '║\n';
        output += '╚' + '═'.repeat(78) + '╝\n\n';

        // Sort by directory structure
        this.codeFiles.sort((a, b) => a.path.localeCompare(b.path));

        if (this.codeFiles.length > 0) {
            let currentDirectory = '';

            for (const file of this.codeFiles) {
                const directory = path.dirname(file.path).replace(/\\/g, '/');

                // Print directory header if changed
                if (directory !== currentDirectory) {
                    currentDirectory = directory;
                    output += '\n' + '─'.repeat(80) + '\n';
                    output += `📂 ${directory}/\n`;
                    output += '─'.repeat(80) + '\n';
                }

                output += '\n' + '┌' + '─'.repeat(78) + '┐\n';
                output += `│ 📄 ${file.path.padEnd(75)} │\n`;
                output += '└' + '─'.repeat(78) + '┘\n';
                output += file.content + '\n';
            }
        } else {
            output += 'Tidak ada file kode custom yang ditemukan.\n\n';
        }

        // SECTION 3: IMAGES
        output += '\n' + '╔' + '═'.repeat(78) + '╗\n';
        output += '║' + ' '.repeat(27) + '🖼️  FILE GAMBAR' + ' '.repeat(36) + '║\n';
        output += '╚' + '═'.repeat(78) + '╝\n\n';

        if (this.imageFiles.length > 0) {
            // Group by directory
            const imagesByDir = {};
            this.imageFiles.forEach(file => {
                const dir = path.dirname(file.path).replace(/\\/g, '/');
                if (!imagesByDir[dir]) imagesByDir[dir] = [];
                imagesByDir[dir].push(file);
            });

            for (const [dir, files] of Object.entries(imagesByDir).sort()) {
                output += `\n📂 ${dir}/\n`;
                files.forEach(file => {
                    output += `   ├── ${file.fileName}\n`;
                });
            }
        } else {
            output += 'Tidak ada file gambar yang ditemukan.\n';
        }

        // SECTION 4: AUDIO
        if (this.audioFiles.length > 0) {
            output += '\n' + '╔' + '═'.repeat(78) + '╗\n';
            output += '║' + ' '.repeat(27) + '🔊 FILE AUDIO' + ' '.repeat(38) + '║\n';
            output += '╚' + '═'.repeat(78) + '╝\n\n';

            // Group by directory
            const audioByDir = {};
            this.audioFiles.forEach(file => {
                const dir = path.dirname(file.path).replace(/\\/g, '/');
                if (!audioByDir[dir]) audioByDir[dir] = [];
                audioByDir[dir].push(file);
            });

            for (const [dir, files] of Object.entries(audioByDir).sort()) {
                output += `\n📂 ${dir}/\n`;
                files.forEach(file => {
                    output += `   ├── ${file.fileName}\n`;
                });
            }
        }

        // SECTION 5: EMPTY FOLDERS
        if (this.emptyFolders.length > 0) {
            output += '\n' + '╔' + '═'.repeat(78) + '╗\n';
            output += '║' + ' '.repeat(26) + '📭 FOLDER KOSONG' + ' '.repeat(37) + '║\n';
            output += '╚' + '═'.repeat(78) + '╝\n\n';

            this.emptyFolders.sort();
            for (const folder of this.emptyFolders) {
                output += `📁 ${folder}/ (kosong)\n`;
            }
        }

        // SECTION 6: STATISTICS
        output += '\n' + '╔' + '═'.repeat(78) + '╗\n';
        output += '║' + ' '.repeat(30) + '📊 STATISTIK' + ' '.repeat(37) + '║\n';
        output += '╚' + '═'.repeat(78) + '╝\n\n';

        output += `┌─────────────────────────────────────────┬──────────┐\n`;
        output += `│ Total file di-scan                      │ ${String(this.stats.totalScanned).padStart(8)} │\n`;
        output += `│ File bawaan Laravel (di-skip)           │ ${String(this.stats.skippedLaravel).padStart(8)} │\n`;
        output += `│ File custom (diambil)                   │ ${String(this.stats.customFiles).padStart(8)} │\n`;
        output += `├─────────────────────────────────────────┼──────────┤\n`;
        output += `│   - File kode (.php, .js, .blade, dll)  │ ${String(this.codeFiles.length).padStart(8)} │\n`;
        output += `│   - File gambar (.png, .jpg, .svg, dll) │ ${String(this.imageFiles.length).padStart(8)} │\n`;
        output += `│   - File audio (.mp3, .wav, dll)        │ ${String(this.audioFiles.length).padStart(8)} │\n`;
        output += `├─────────────────────────────────────────┼──────────┤\n`;
        output += `│ Folder kosong                           │ ${String(this.emptyFolders.length).padStart(8)} │\n`;
        output += `└─────────────────────────────────────────┴──────────┘\n`;

        // SECTION 7: FILE BREAKDOWN BY TYPE
        output += '\n' + '╔' + '═'.repeat(78) + '╗\n';
        output += '║' + ' '.repeat(24) + '📋 BREAKDOWN BY TYPE' + ' '.repeat(35) + '║\n';
        output += '╚' + '═'.repeat(78) + '╝\n\n';

        const fileTypes = {};
        this.codeFiles.forEach(file => {
            const ext = path.extname(file.path);
            fileTypes[ext] = (fileTypes[ext] || 0) + 1;
        });

        const sortedTypes = Object.entries(fileTypes).sort((a, b) => b[1] - a[1]);

        output += `┌────────────────────┬──────────┐\n`;
        output += `│ Ekstensi           │ Jumlah   │\n`;
        output += `├────────────────────┼──────────┤\n`;

        for (const [ext, count] of sortedTypes) {
            output += `│ ${ext.padEnd(18)} │ ${String(count).padStart(8)} │\n`;
        }

        output += `└────────────────────┴──────────┘\n`;

        return output;
    }

    async extract() {
        console.log('🚀 Memulai ekstraksi Laravel project...');
        console.log(`📁 Path: ${this.config.laravelPath}`);

        // Cek apakah path ada
        if (!fs.existsSync(this.config.laravelPath)) {
            throw new Error(`Path tidak ditemukan: ${this.config.laravelPath}`);
        }

        // Scan directory
        console.log('🔍 Scanning files...');
        await this.scanDirectory(this.config.laravelPath);

        // Generate output
        console.log('📝 Generating output...');
        const output = this.generateOutput();

        // Simpan ke file
        await fs.promises.writeFile(this.config.outputFile, output, 'utf8');

        console.log('\n✅ Selesai!');
        console.log(`📄 Hasil disimpan di: ${this.config.outputFile}`);
        console.log(`\n📊 Statistik:`);
        console.log(`   Total file di-scan: ${this.stats.totalScanned}`);
        console.log(`   File bawaan Laravel (di-skip): ${this.stats.skippedLaravel}`);
        console.log(`   File custom (diambil): ${this.stats.customFiles}`);
        console.log(`     - File kode: ${this.codeFiles.length}`);
        console.log(`     - File gambar: ${this.imageFiles.length}`);
        console.log(`     - File audio: ${this.audioFiles.length}`);
        console.log(`   Folder kosong: ${this.emptyFolders.length}`);
    }
}

// Jalankan ekstraksi
const extractor = new LaravelExtractor(config);

extractor.extract().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
});
