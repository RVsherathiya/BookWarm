import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useLanguage } from '../../contexts/LanguageContext';
import { COLORS, FONT_SIZES, SPACING } from '../../constants';
import { Button, Input, Card, Loading } from '../../components';

interface PDFDocument {
  id: string;
  title: string;
  type: 'quiz' | 'challenge' | 'worksheet' | 'lesson' | 'presentation' | 'cv';
  subject: string;
  createdAt: string;
  lastModified: string;
  size: string;
  pages: number;
  coinsUsed: number;
}

const PDFEditorScreen: React.FC = () => {
  const { t, language } = useLanguage();
  const [documents, setDocuments] = useState<PDFDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<PDFDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<PDFDocument | null>(
    null,
  );
  const [editingMode, setEditingMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const isRTL = language === 'ar';

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    filterDocuments();
  }, [searchQuery, documents]);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Mock data - replace with actual data from storage
      const mockDocuments: PDFDocument[] = [
        {
          id: '1',
          title: 'Math Quiz - Algebra Basics',
          type: 'quiz',
          subject: 'Mathematics',
          createdAt: '2024-01-15',
          lastModified: '2024-01-15',
          size: '2.5 MB',
          pages: 5,
          coinsUsed: 20,
        },
        {
          id: '2',
          title: 'Science Challenge - Photosynthesis',
          type: 'challenge',
          subject: 'Science',
          createdAt: '2024-01-14',
          lastModified: '2024-01-14',
          size: '3.2 MB',
          pages: 8,
          coinsUsed: 25,
        },
        {
          id: '3',
          title: 'English Worksheet - Grammar',
          type: 'worksheet',
          subject: 'English',
          createdAt: '2024-01-13',
          lastModified: '2024-01-13',
          size: '1.8 MB',
          pages: 4,
          coinsUsed: 15,
        },
        {
          id: '4',
          title: 'History Lesson - World War II',
          type: 'lesson',
          subject: 'History',
          createdAt: '2024-01-12',
          lastModified: '2024-01-12',
          size: '4.1 MB',
          pages: 12,
          coinsUsed: 30,
        },
        {
          id: '5',
          title: 'Biology Presentation - Cell Structure',
          type: 'presentation',
          subject: 'Biology',
          createdAt: '2024-01-11',
          lastModified: '2024-01-11',
          size: '5.5 MB',
          pages: 15,
          coinsUsed: 35,
        },
        {
          id: '6',
          title: 'John Doe - Software Engineer CV',
          type: 'cv',
          subject: 'Professional',
          createdAt: '2024-01-10',
          lastModified: '2024-01-10',
          size: '1.2 MB',
          pages: 2,
          coinsUsed: 25,
        },
      ];

      setDocuments(mockDocuments);
    } catch (error) {
      Alert.alert(t('common.error'), t('pdf.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const filterDocuments = () => {
    if (!searchQuery.trim()) {
      setFilteredDocuments(documents);
      return;
    }

    const filtered = documents.filter(
      doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredDocuments(filtered);
  };

  const handleViewDocument = (document: PDFDocument) => {
    setSelectedDocument(document);
    setEditingMode(false);
    setEditContent(''); // Reset edit content
  };

  const handleEditDocument = (document: PDFDocument) => {
    setSelectedDocument(document);
    setEditingMode(true);
    setEditContent('Sample PDF content for editing...'); // Mock content
  };

  const handleDeleteDocument = (document: PDFDocument) => {
    Alert.alert(t('common.confirm'), t('pdf.deleteConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => {
          setDocuments(prev => prev.filter(d => d.id !== document.id));
          Alert.alert(t('common.success'), t('pdf.deletedSuccessfully'));
        },
      },
    ]);
  };

  const handleSaveChanges = () => {
    if (!selectedDocument) return;

    // Save changes to local storage
    Alert.alert(t('common.success'), t('pdf.savedSuccessfully'));
    setEditingMode(false);
  };

  const handleExportDocument = (document: PDFDocument) => {
    // Export document
    Alert.alert(t('common.success'), t('pdf.exportedSuccessfully'));
  };

  const getDocumentIcon = (type: string) => {
    const icons = {
      quiz: 'quiz',
      challenge: 'extension',
      worksheet: 'assignment',
      lesson: 'school',
      presentation: 'slideshow',
      cv: 'description',
    };
    return icons[type as keyof typeof icons] || 'description';
  };

  const getDocumentColor = (type: string) => {
    const colors = {
      quiz: COLORS.primary,
      challenge: COLORS.warning,
      worksheet: COLORS.success,
      lesson: COLORS.secondary,
      presentation: COLORS.info,
      cv: COLORS.gray,
    };
    return colors[type as keyof typeof colors] || COLORS.gray;
  };

  const renderDocumentCard = (document: PDFDocument) => (
    <Card key={document.id} style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <View style={styles.documentTitleRow}>
            <Icon
              name={getDocumentIcon(document.type)}
              size={20}
              color={getDocumentColor(document.type)}
            />
            <Text style={styles.documentTitle}>{document.title}</Text>
          </View>
          <View style={styles.documentMeta}>
            <Text style={styles.documentType}>
              {document.type.toUpperCase()}
            </Text>
            <Text style={styles.documentSubject}>{document.subject}</Text>
          </View>
        </View>
        <View style={styles.documentActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleViewDocument(document)}
          >
            <Icon name="visibility" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditDocument(document)}
          >
            <Icon name="edit" size={20} color={COLORS.warning} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteDocument(document)}
          >
            <Icon name="delete" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.documentDetails}>
        <View style={styles.detailRow}>
          <Icon name="description" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>
            {document.pages} {t('pdf.pages')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="storage" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{document.size}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="schedule" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>{document.lastModified}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="monetization-on" size={16} color={COLORS.gray} />
          <Text style={styles.detailText}>
            {document.coinsUsed} {t('pdf.coins')}
          </Text>
        </View>
      </View>

      <View style={styles.documentFooter}>
        <Button
          title={t('pdf.export')}
          onPress={() => handleExportDocument(document)}
          style={styles.exportButton}
          variant="outline"
        />
        <Button
          title={t('pdf.edit')}
          onPress={() => handleEditDocument(document)}
          style={styles.editButton}
        />
      </View>
    </Card>
  );

  const renderDocumentViewer = () => {
    if (!selectedDocument) return null;

    return (
      <View style={styles.viewerModal}>
        <View style={styles.viewerHeader}>
          <Text style={styles.viewerTitle}>{selectedDocument.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedDocument(null)}
          >
            <Icon name="close" size={24} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.viewerContent}>
          {editingMode ? (
            <View style={styles.editorContainer}>
              <Text style={styles.editorTitle}>{t('pdf.editContent')}</Text>
              <TextInput
                style={styles.editorInput}
                value={editContent}
                onChangeText={setEditContent}
                multiline
                placeholder={t('pdf.enterContent')}
                placeholderTextColor={COLORS.gray}
              />
              <View style={styles.editorActions}>
                <Button
                  title={t('common.cancel')}
                  onPress={() => setEditingMode(false)}
                  style={styles.cancelButton}
                  variant="outline"
                />
                <Button
                  title={t('common.save')}
                  onPress={handleSaveChanges}
                  style={styles.saveButton}
                />
              </View>
            </View>
          ) : (
            <View style={styles.previewContainer}>
              <Icon name="description" size={64} color={COLORS.lightGray} />
              <Text style={styles.previewTitle}>
                {t('pdf.documentPreview')}
              </Text>
              <Text style={styles.previewDescription}>
                {t('pdf.previewDescription')}
              </Text>
              <View style={styles.previewInfo}>
                <Text style={styles.previewInfoText}>
                  {t('pdf.pages')}: {selectedDocument.pages}
                </Text>
                <Text style={styles.previewInfoText}>
                  {t('pdf.size')}: {selectedDocument.size}
                </Text>
                <Text style={styles.previewInfoText}>
                  {t('pdf.type')}: {selectedDocument.type}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.viewerActions}>
          <Button
            title={t('pdf.export')}
            onPress={() => handleExportDocument(selectedDocument)}
            style={styles.exportButton}
          />
          <Button
            title={editingMode ? t('pdf.view') : t('pdf.edit')}
            onPress={() => setEditingMode(!editingMode)}
            style={styles.editButton}
            variant="outline"
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            /* Navigate back */
          }}
        >
          <Icon name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('pdf.pdfEditor')}</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={20}
            color={COLORS.gray}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('pdf.searchDocuments')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredDocuments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="description" size={64} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>{t('pdf.noDocuments')}</Text>
            <Text style={styles.emptyDescription}>
              {searchQuery
                ? t('pdf.noSearchResults')
                : t('pdf.createFirstDocument')}
            </Text>
          </View>
        ) : (
          filteredDocuments.map(renderDocumentCard)
        )}
      </ScrollView>

      {selectedDocument && renderDocumentViewer()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerRight: {
    width: 24,
  },
  searchContainer: {
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
  documentCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  documentInfo: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  documentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  documentTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  documentMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  documentType: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  documentSubject: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  documentActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    padding: SPACING.sm,
    borderRadius: 6,
    backgroundColor: COLORS.background,
  },
  documentDetails: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  documentFooter: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  exportButton: {
    flex: 1,
  },
  editButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  viewerModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 1000,
  },
  viewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  viewerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.md,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  viewerContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  editorContainer: {
    flex: 1,
  },
  editorTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  editorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    backgroundColor: COLORS.white,
    textAlignVertical: 'top',
  },
  editorActions: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.success,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  previewDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  previewInfo: {
    alignItems: 'center',
  },
  previewInfoText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  viewerActions: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
});

export default PDFEditorScreen;
